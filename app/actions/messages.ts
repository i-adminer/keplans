"use server";

import { db } from "@/lib/db";
import { messages, users } from "@/lib/db/schema";
import { eq, desc, and, isNull, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/auth/session";
import { sendEmail, getContactAutoReplyHTML } from "@/lib/email";
import { revalidatePath } from "next/cache";

// ============================================================================
// CONTACT FORM - Guest or Customer sends message
// ============================================================================
export async function sendContactMessage(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const timeline = formData.get("timeline") as string;
    const content = formData.get("message") as string;

    if (!firstName || !lastName || !email || !content) {
      return { error: "Required fields missing" };
    }

    const subject = `Contact: ${firstName} ${lastName} - Timeline: ${timeline}`;
    const messageId = nanoid();

    // Find or create guest user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Create guest user with all required fields
      const userId = nanoid();
      const newUser = {
        id: userId,
        email,
        firstName,
        lastName,
        phone: phone || null,
        role: "customer" as const,
        emailVerified: false,
        passwordHash: "",
        addressStreet: null,
        addressCity: null,
        addressState: null,
        addressCountry: "Kenya",
        addressPostalCode: null,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        phoneVerified: false,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        totalOrders: 0,
        totalSpent: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };
      await db.insert(users).values(newUser);
      user = newUser;
    }

    // Save message
    await db.insert(messages).values({
      id: messageId,
      customerId: user.id,
      subject,
      content,
      senderType: "customer",
      senderId: user.id,
      read: false,
      parentMessageId: null,
      createdAt: new Date(),
    });

    // Send auto-reply to customer
    await sendEmail({
      to: email,
      subject: `We received your message: ${subject}`,
      html: getContactAutoReplyHTML(`${firstName} ${lastName}`),
      emailType: "contact_auto_reply",
      userId: user.id,
    });

    // Notify admin via email with Reply-To header
    const adminEmail = process.env.EMAIL_USER || process.env.EMAIL_FROM;
    await sendEmail({
      to: adminEmail!,
      replyTo: email,
      subject: `New Contact: ${firstName} ${lastName} - ${timeline}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:20px auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#333;margin-top:0;">New Contact Message</h2>
          <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:15px 0;">
            <p style="margin:5px 0;"><strong>From:</strong> ${firstName} ${lastName}</p>
            <p style="margin:5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin:5px 0;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p style="margin:5px 0;"><strong>Timeline:</strong> ${timeline}</p>
          </div>
          <div style="margin:20px 0;">
            <p style="margin:5px 0;"><strong>Message:</strong></p>
            <p style="line-height:1.6;color:#555;">${content}</p>
          </div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0;">
          <p style="font-size:12px;color:#999;">Reply to this email to respond directly to ${firstName}. Message ID: ${messageId}</p>
        </div>
      `,
      emailType: "admin_notification",
    });

    revalidatePath("/hp-admin/messages");
    return { success: true, messageId };
  } catch (error) {
    console.error("Send contact message error:", error);
    return { error: "Failed to send message" };
  }
}

// ============================================================================
// ADMIN REPLIES TO MESSAGE
// ============================================================================
export async function replyToMessage(parentMessageId: string, replyContent: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "Unauthorized" };
    }

    // Get original message
    const original = await db.query.messages.findFirst({
      where: eq(messages.id, parentMessageId),
      with: { customer: true },
    });

    if (!original) return { error: "Message not found" };

    const customer = original.customer;
    const replyId = nanoid();

    // Save reply as a message
    await db.insert(messages).values({
      id: replyId,
      customerId: original.customerId,
      subject: original.subject,
      content: replyContent,
      senderType: "admin",
      senderId: session.id,
      read: true, // Admin messages are always "read"
      parentMessageId,
      createdAt: new Date(),
    });

    // Mark original as read
    await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, parentMessageId));

    // Send email to customer with reply
    await sendEmail({
      to: customer.email,
      replyTo: process.env.EMAIL_USER || process.env.EMAIL_FROM,
      subject: `Re: ${original.subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:20px auto;padding:20px;">
          <h2 style="color:#333;">KEPlans Team Response</h2>
          <div style="background:#f9f9f9;padding:20px;border-left:4px solid #4CAF50;margin:20px 0;">
            ${replyContent.replace(/\n/g, '<br>')}
          </div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;">
          <div style="background:#f5f5f5;padding:15px;border-radius:5px;">
            <p style="margin:5px 0;font-size:12px;color:#666;"><strong>Your original message:</strong></p>
            <p style="margin:10px 0;color:#555;font-size:14px;">${original.content}</p>
            <p style="margin:5px 0;font-size:12px;color:#999;">${new Date(original.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;">
          <p style="font-size:12px;color:#999;text-align:center;">
            Reply to this email to continue the conversation with our team.
          </p>
        </div>
      `,
      emailType: "admin_reply",
      userId: customer.id,
    });

    revalidatePath("/hp-admin/messages");
    return { success: true, replyId };
  } catch (error) {
    console.error("Reply to message error:", error);
    return { error: "Failed to send reply" };
  }
}

// ============================================================================
// GET ALL MESSAGES (Admin Dashboard)
// ============================================================================
export async function getAllMessages() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "Unauthorized" };
    }

    // Get all root messages (no parent) with their threads
    const rootMessages = await db.query.messages.findMany({
      where: isNull(messages.parentMessageId),
      orderBy: [desc(messages.createdAt)],
      with: { customer: true },
    });

    // For each root message, get all replies
    const messagesWithThreads = await Promise.all(
      rootMessages.map(async (msg) => {
        const replies = await db.query.messages.findMany({
          where: eq(messages.parentMessageId, msg.id),
          orderBy: [desc(messages.createdAt)],
          with: { customer: true },
        });

        const allInThread = [msg, ...replies];
        const unreadCount = allInThread.filter(
          (m) => m.senderType === "customer" && !m.read
        ).length;

        return {
          id: msg.id,
          customerName: `${msg.customer.firstName} ${msg.customer.lastName}`,
          customerEmail: msg.customer.email,
          customerPhone: msg.customer.phone,
          subject: msg.subject,
          preview: msg.content.substring(0, 100),
          timestamp: msg.createdAt,
          unread: unreadCount > 0,
          unreadCount,
          threadCount: allInThread.length,
          thread: allInThread.map((m) => ({
            id: m.id,
            sender: m.senderType as "customer" | "admin",
            senderName:
              m.senderType === "customer"
                ? `${msg.customer.firstName} ${msg.customer.lastName}`
                : "KEPlans Admin",
            content: m.content,
            timestamp: m.createdAt,
            read: m.read,
          })),
        };
      })
    );

    return { success: true, messages: messagesWithThreads };
  } catch (error) {
    console.error("Get all messages error:", error);
    return { error: "Failed to get messages" };
  }
}

// ============================================================================
// MARK MESSAGE AS READ
// ============================================================================
export async function markMessageAsRead(messageId: string) {
  try {
    await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, messageId));

    revalidatePath("/hp-admin/messages");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark as read" };
  }
}

// ============================================================================
// MARK ALL MESSAGES IN THREAD AS READ
// ============================================================================
export async function markThreadAsRead(rootMessageId: string) {
  try {
    // Mark root
    await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, rootMessageId));

    // Mark all replies
    await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.parentMessageId, rootMessageId));

    revalidatePath("/hp-admin/messages");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark thread as read" };
  }
}


// ============================================================================
// SEND MESSAGE TO CUSTOMER (Admin initiated)
// ============================================================================
export async function sendMessageToCustomer(
  customerId: string,
  subject: string,
  content: string
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "Unauthorized" };
    }

    // Get customer info
    const customer = await db.query.users.findFirst({
      where: eq(users.id, customerId),
    });

    if (!customer) return { error: "Customer not found" };

    const messageId = nanoid();

    // Save message
    await db.insert(messages).values({
      id: messageId,
      customerId,
      subject,
      content,
      senderType: "admin",
      senderId: session.id,
      read: true, // Admin messages are marked as read
      parentMessageId: null,
      createdAt: new Date(),
    });

    // Send email to customer
    await sendEmail({
      to: customer.email,
      replyTo: process.env.EMAIL_USER || process.env.EMAIL_FROM,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:20px auto;padding:20px;">
          <h2 style="color:#002366;">Message from KEPlans</h2>
          <div style="background:#f9f9f9;padding:20px;border-left:4px solid #002366;margin:20px 0;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:30px 0;">
          <p style="font-size:12px;color:#999;text-align:center;">
            Reply to this email to continue the conversation with our team.
          </p>
        </div>
      `,
      emailType: "admin_message",
      userId: customerId,
    });

    revalidatePath("/hp-admin/messages");
    revalidatePath("/hp-admin/customers");
    return { success: true, messageId };
  } catch (error) {
    console.error("Send message to customer error:", error);
    return { error: "Failed to send message" };
  }
}
