"use server";

import { db } from "@/lib/db";
import { users, otpCodes } from "@/lib/db/schema";
import { hashPassword, verifyPassword, generateToken, generateOTP } from "@/lib/auth/password";
import { setAuthCookie, clearAuthCookie, getSession } from "@/lib/auth/session";
import { sendEmail, getWelcomeEmailHTML, getOTPEmailHTML, getPasswordResetEmailHTML } from "@/lib/email";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

// ============================================================================
// SIGNUP
// ============================================================================

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "All fields are required" };
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email address" };
  }

  // Validate password
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = nanoid();
    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role: "customer",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send OTP for email verification
    const otp = generateOTP();
    await db.insert(otpCodes).values({
      id: nanoid(),
      userId,
      code: otp,
      purpose: "email-verification",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      used: false,
      createdAt: new Date(),
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Email - KEPlans",
      html: getOTPEmailHTML(firstName, otp, "email_verification"),
      emailType: "otp",
      userId,
    });

    return { success: true, userId, email };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An error occurred during signup" };
  }
}

// ============================================================================
// SIGNIN
// ============================================================================

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // For admin users, send OTP instead of setting cookie
    if (user.role === "admin") {
      const otp = generateOTP();
      await db.insert(otpCodes).values({
        id: nanoid(),
        userId: user.id,
        code: otp,
        purpose: "admin-login",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        used: false,
        createdAt: new Date(),
      });

      await sendEmail({
        to: user.email,
        subject: "Admin Login OTP - KEPlans",
        html: getOTPEmailHTML(user.firstName, otp, "admin_login"),
        emailType: "otp",
        userId: user.id,
      });

      return { success: true, role: user.role, requiresOTP: true, email: user.email };
    }

    // For customers, set cookie directly
    await setAuthCookie({
      id: user.id,
      email: user.email,
      role: user.role as "customer" | "admin",
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Signin error:", error);
    return { error: "An error occurred during signin" };
  }
}

// ============================================================================
// SIGNOUT
// ============================================================================

export async function signOut() {
  await clearAuthCookie();
  return { success: true };
}

// ============================================================================
// FORGOT PASSWORD
// ============================================================================

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      // Don't reveal if email exists
      return { success: true, message: "If this email exists, a reset link has been sent" };
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db
      .update(users)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      })
      .where(eq(users.id, user.id));

    // Send reset email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: getPasswordResetEmailHTML(user.firstName, resetLink),
      emailType: "password_reset",
      userId: user.id,
    });

    return { success: true, message: "If this email exists, a reset link has been sent" };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "An error occurred" };
  }
}

// ============================================================================
// RESET PASSWORD
// ============================================================================

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    return { error: "Invalid request" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.resetPasswordToken, token),
      ),
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return { error: "Invalid or expired reset token" };
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password and clear reset token
    await db
      .update(users)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An error occurred" };
  }
}

// ============================================================================
// REQUEST OTP (for admin password change, etc.)
// ============================================================================

export async function requestOTP(purpose: "password_change" | "email_verification") {
  const session = await getSession();
  
  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.id),
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP
    await db.insert(otpCodes).values({
      id: nanoid(),
      userId: user.id,
      code: otp,
      purpose,
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Your Verification Code",
      html: getOTPEmailHTML(user.firstName, otp, purpose),
      emailType: "otp",
      userId: user.id,
    });

    return { success: true };
  } catch (error) {
    console.error("Request OTP error:", error);
    return { error: "An error occurred" };
  }
}

// ============================================================================
// VERIFY OTP
// ============================================================================

export async function verifyOTP(code: string, purpose: string) {
  try {
    const otpRecord = await db.query.otpCodes.findFirst({
      where: and(
        eq(otpCodes.code, code),
        eq(otpCodes.purpose, purpose),
        eq(otpCodes.used, false)
      ),
    });

    if (!otpRecord) {
      return { error: "Invalid OTP code" };
    }

    if (otpRecord.expiresAt < new Date()) {
      return { error: "OTP code expired" };
    }

    // Mark as used
    await db
      .update(otpCodes)
      .set({ used: true })
      .where(eq(otpCodes.id, otpRecord.id));

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, otpRecord.userId),
    });

    if (!user) {
      return { error: "User not found" };
    }

    // If email verification, mark user as verified, send welcome email, and set cookie
    if (purpose === "email-verification") {
      if (!user.emailVerified) {
        await db
          .update(users)
          .set({ emailVerified: true, updatedAt: new Date() })
          .where(eq(users.id, otpRecord.userId));

        // Set auth cookie NOW after verification
        await setAuthCookie({
          id: user.id,
          email: user.email,
          role: user.role as "customer" | "admin",
          firstName: user.firstName,
          lastName: user.lastName,
        });

        // Send welcome email
        await sendEmail({
          to: user.email,
          subject: "Welcome to KEPlans!",
          html: getWelcomeEmailHTML(user.firstName),
          emailType: "welcome",
          userId: user.id,
        });
      }
    }

    // If admin login, set cookie after OTP verification
    if (purpose === "admin-login") {
      await setAuthCookie({
        id: user.id,
        email: user.email,
        role: user.role as "customer" | "admin",
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { error: "An error occurred" };
  }
}

// ============================================================================
// CHANGE PASSWORD (requires OTP verification first)
// ============================================================================

export async function changePassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const otpCode = formData.get("otp") as string;

  const session = await getSession();
  
  if (!session) {
    return { error: "Not authenticated" };
  }

  if (!currentPassword || !newPassword || !otpCode) {
    return { error: "All fields are required" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  try {
    // Verify OTP first
    const otpResult = await verifyOTP(otpCode, "password_change");
    if (!otpResult.success) {
      return otpResult;
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.id),
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "An error occurred" };
  }
}

// ============================================================================
// GET CURRENT USER
// ============================================================================

export async function getCurrentUser() {
  return await getSession();
}
