"use server";

import { db } from "@/lib/db";
import { housePlans, orders, messages, users } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    const [plansCount, ordersCount, messagesCount, customersCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(housePlans),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ count: sql<number>`count(*)` }).from(messages).where(eq(messages.read, false)),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "customer")),
    ]);

    return {
      totalPlans: Number(plansCount[0]?.count || 0),
      activeOrders: Number(ordersCount[0]?.count || 0),
      unreadMessages: Number(messagesCount[0]?.count || 0),
      totalCustomers: Number(customersCount[0]?.count || 0),
    };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return {
      totalPlans: 0,
      activeOrders: 0,
      unreadMessages: 0,
      totalCustomers: 0,
    };
  }
}

export async function getRecentOrders(limit = 5) {
  try {
    const recentOrders = await db.query.orders.findMany({
      limit,
      orderBy: [desc(orders.createdAt)],
      with: {
        customer: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
        items: {
          limit: 1,
          with: {
            plan: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    return recentOrders.map((order) => ({
      id: order.orderNumber,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      plan: order.items[0]?.plan.name || "N/A",
      amount: Number(order.total),
      status: order.status,
    }));
  } catch (error) {
    console.error("Get recent orders error:", error);
    return [];
  }
}

export async function getRecentMessages(limit = 5) {
  try {
    const recentMessages = await db.query.messages.findMany({
      limit,
      orderBy: [desc(messages.createdAt)],
      with: {
        customer: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return recentMessages.map((msg) => ({
      id: msg.id,
      sender: `${msg.customer.firstName} ${msg.customer.lastName}`,
      subject: msg.subject,
      time: getTimeAgo(msg.createdAt),
      unread: !msg.read,
    }));
  } catch (error) {
    console.error("Get recent messages error:", error);
    return [];
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
  return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
}
