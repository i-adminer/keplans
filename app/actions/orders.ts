"use server";

import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  paymentTransactions,
  housePlans,
  planDocuments,
  users,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/auth/session";
import paystack from "@/lib/paystack";
import { sendEmail, getOrderConfirmationEmailHTML, getDocumentDeliveryEmailHTML } from "@/lib/email";

// Generate unique order number
function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const rand = nanoid(6).toUpperCase();
  return `KEP-${y}${m}${d}-${rand}`;
}

interface CreateOrderParams {
  phone: string;
  items: Array<{
    planId: string;
    planName: string;
    planNumber?: string;
    price: number;
    type: string;
  }>;
}

export async function createOrder(params: CreateOrderParams) {
  try {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const { phone, items } = params;
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const orderId = nanoid();
    const orderNumber = generateOrderNumber();
    const paymentReference = `PAY-${nanoid(12).toUpperCase()}`;

    // 1. Create order
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      customerId: session.id,
      subtotal: String(total),
      total: String(total),
      status: "pending",
      paymentStatus: "pending",
      deliveryStatus: "pending",
      deliveryEmail: session.email,
      paymentReference,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Create order items
    for (const item of items) {
      await db.insert(orderItems).values({
        id: nanoid(),
        orderId,
        planId: item.planId,
        planName: item.planName,
        planNumber: item.planNumber || item.planId,
        planType: item.type,
        selectedOptions: {},
        basePrice: String(item.price),
        itemTotal: String(item.price),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 3. Create payment transaction
    await db.insert(paymentTransactions).values({
      id: nanoid(),
      orderId,
      amount: String(total),
      currency: "KES",
      paymentMethod: "card",
      provider: "paystack",
      providerReference: paymentReference,
      status: "pending",
      initiatedAt: new Date(),
    });

    // 4. Initialize Paystack payment
    const paystackResponse = await paystack.transaction.initialize({
      name: `${session.firstName} ${session.lastName}`,
      email: session.email,
      amount: total * 100,
      reference: paymentReference,
      currency: "KES",
      channels: ["card", "mobile_money", "bank_transfer"],
      metadata: {
        orderId,
        orderNumber,
        customerId: session.id,
        customerName: `${session.firstName} ${session.lastName}`,
        customerPhone: phone,
        items: items.map((i) => ({
          planId: i.planId,
          planName: i.planName,
          price: i.price,
          type: i.type,
        })),
      },
    });

    if (!paystackResponse.status) {
      return {
        error: paystackResponse.message || "Failed to initialize payment",
      };
    }

    return {
      success: true,
      orderId,
      orderNumber,
      paymentReference,
      authorizationUrl: paystackResponse.data.authorization_url,
    };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "Failed to create order" };
  }
}

export async function verifyOrder(paymentReference: string) {
  try {
    const response = await paystack.transaction.verify(paymentReference);

    if (!response.status) {
      return { error: "Payment verification failed" };
    }

    const { data } = response;

    // Map Paystack channel to our payment method
    const paymentMethod =
      data.channel === "mobile_money"
        ? "mpesa"
        : data.channel === "card"
          ? "card"
          : data.channel === "bank_transfer"
            ? "bank_transfer"
            : "card";

    // Get M-Pesa details if available
    const mpesaNumber = data.authorization?.mobile_money_number || null;

    // Update payment transaction
    await db
      .update(paymentTransactions)
      .set({
        status: "completed",
        paymentMethod,
        providerTransactionId: String(data.id),
        providerResponse: data,
        mpesaPhoneNumber: mpesaNumber,
        completedAt: new Date(),
      })
      .where(eq(paymentTransactions.providerReference, paymentReference));

    // Update order
    await db
      .update(orders)
      .set({
        status: "payment_confirmed",
        paymentStatus: "completed",
        paymentMethod,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.paymentReference, paymentReference));

    // Increment plan order count
    const orderData = await db.query.orders.findFirst({
      where: eq(orders.paymentReference, paymentReference),
      with: { items: true },
    });

    if (orderData?.items) {
      for (const item of orderData.items) {
        const plan = await db.query.housePlans.findFirst({
          where: eq(housePlans.id, item.planId),
          columns: { orders: true },
        });

        if (plan) {
          await db
            .update(housePlans)
            .set({
              orders: (plan.orders || 0) + 1,
            })
            .where(eq(housePlans.id, item.planId));
        }
      }

      // Get customer info
      const customer = await db.query.users.findFirst({
        where: eq(users.id, orderData.customerId),
      });

      const customerName = customer
        ? `${customer.firstName} ${customer.lastName}`
        : "Valued Customer";

      // 1. Send order confirmation email
      await sendEmail({
        to: orderData.deliveryEmail,
        subject: `Order Confirmed - ${orderData.orderNumber}`,
        html: getOrderConfirmationEmailHTML({
          customerName,
          orderNumber: orderData.orderNumber,
          items: orderData.items.map((i) => ({
            planName: i.planName,
            price: Number(i.itemTotal),
            type: i.planType,
          })),
          total: Number(orderData.total),
        }),
        emailType: "order_confirmation",
        userId: orderData.customerId,
      });

      // 2. Send document delivery email with download links
      const itemsWithDocs = await Promise.all(
        orderData.items.map(async (item) => {
          const docs = await db.query.planDocuments.findMany({
            where: eq(planDocuments.planId, item.planId),
          });

          return {
            planName: item.planName,
            planNumber: item.planNumber,
            type: item.planType,
            documents: docs.map((doc) => ({
              fileName: doc.fileName,
              downloadUrl: doc.cloudinaryUrl,
              documentType: doc.documentType,
              fileSize: doc.fileSize,
            })),
          };
        })
      );

      await sendEmail({
        to: orderData.deliveryEmail,
        subject: `Download Your Plans - ${orderData.orderNumber}`,
        html: getDocumentDeliveryEmailHTML({
          customerName,
          orderNumber: orderData.orderNumber,
          items: itemsWithDocs,
        }),
        emailType: "document_delivery",
        userId: orderData.customerId,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Verify order error:", error);
    return { error: "Failed to verify payment" };
  }
}

export async function getOrderByReference(paymentReference: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.paymentReference, paymentReference),
      with: {
        items: true,
        payments: true,
      },
    });

    if (!order) return { error: "Order not found" };

    return { success: true, order };
  } catch (error) {
    return { error: "Failed to get order" };
  }
}


export async function getAllOrders() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const allOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: {
        customer: true,
        items: {
          with: {
            plan: true,
          },
        },
      },
    });

    return {
      success: true,
      orders: allOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
        plan: order.items.map((i) => i.planName).join(", "),
        amount: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
    };
  } catch (error) {
    console.error("Get all orders error:", error);
    return { error: "Failed to fetch orders" };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        customer: true,
        items: {
          with: {
            plan: {
              with: {
                documents: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) return { error: "Order not found" };

    return { success: true, order };
  } catch (error) {
    console.error("Get order by ID error:", error);
    return { error: "Failed to fetch order" };
  }
}
