"use server";

import { db } from "@/lib/db";
import { users, orders } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function getAllCustomers() {
  try {
    const customers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        emailVerified: users.emailVerified,
        totalOrders: sql<number>`COALESCE(COUNT(${orders.id}), 0)`,
        totalSpent: sql<string>`COALESCE(SUM(${orders.total}), '0')`,
        lastOrderDate: sql<Date>`MAX(${orders.createdAt})`,
      })
      .from(users)
      .leftJoin(orders, eq(orders.customerId, users.id))
      .where(eq(users.role, "customer"))
      .groupBy(users.id)
      .orderBy(desc(users.createdAt));

    return { success: true, customers };
  } catch (error) {
    console.error("Get all customers error:", error);
    return { error: "Failed to get customers" };
  }
}
