"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllCustomers() {
  try {
    const customers = await db.query.users.findMany({
      where: eq(users.role, "customer"),
      orderBy: [desc(users.createdAt)],
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        lastLoginAt: true,
        emailVerified: true,
      },
    });

    return { success: true, customers };
  } catch (error) {
    console.error("Get all customers error:", error);
    return { error: "Failed to get customers" };
  }
}
