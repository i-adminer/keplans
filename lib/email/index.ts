import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { emailLogs } from "@/lib/db/schema";
import { nanoid } from "nanoid";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  emailType: string;
  userId?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  emailType,
  userId,
}: SendEmailOptions) {
  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("⚠️ Email not configured. Skipping email send.");
    console.log("📧 [DEV MODE] Would send email:");
    console.log("   To:", to);
    console.log("   Subject:", subject);
    console.log("   Type:", emailType);
    return { success: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to:", to);

    // Log email
    await db.insert(emailLogs).values({
      id: nanoid(),
      userId: userId || null,
      emailType,
      to,
      subject,
      body: html,
      status: "sent",
      sentAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    
    // Log failed email
    await db.insert(emailLogs).values({
      id: nanoid(),
      userId: userId || null,
      emailType,
      to,
      subject,
      body: html,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      sentAt: new Date(),
    });

    return { success: false, error };
  }
}

// Welcome Email Template
export function getWelcomeEmailHTML(firstName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #002366 0%, #0047AB 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1d1d1f; font-size: 24px; margin: 0 0 16px; font-weight: 600; }
          .content p { color: #86868b; line-height: 1.6; margin: 0 0 20px; }
          .button { display: inline-block; background: #002366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 10px 0; }
          .footer { padding: 30px; text-align: center; background: #f5f5f7; }
          .footer p { color: #86868b; font-size: 14px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to KEPlans</h1>
          </div>
          <div class="content">
            <h2>Hello, ${firstName}!</h2>
            <p>Welcome to KEPlans! We're excited to have you on board.</p>
            <p>With KEPlans, you can browse hundreds of house plans, customize them to your needs, and get started on building your dream home.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/plans" class="button">Browse House Plans</a>
            <p style="margin-top: 30px;">If you have any questions, feel free to reach out to our team.</p>
          </div>
          <div class="footer">
            <p>KEPlans - Building Dreams Together</p>
            <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// OTP Email Template
export function getOTPEmailHTML(
  firstName: string,
  otp: string,
  purpose: string,
): string {
  const purposeText =
    purpose === "password_change"
      ? "change your password"
      : "verify your email";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #002366 0%, #0047AB 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; text-align: center; }
          .content h2 { color: #1d1d1f; font-size: 24px; margin: 0 0 16px; font-weight: 600; }
          .content p { color: #86868b; line-height: 1.6; margin: 0 0 20px; }
          .otp-code { font-size: 48px; font-weight: 700; letter-spacing: 8px; color: #002366; margin: 30px 0; font-family: 'Courier New', monospace; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .warning p { color: #856404; margin: 0; font-size: 14px; }
          .footer { padding: 30px; text-align: center; background: #f5f5f7; }
          .footer p { color: #86868b; font-size: 14px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verification Code</h1>
          </div>
          <div class="content">
            <h2>Hello, ${firstName}!</h2>
            <p>You requested to ${purposeText}. Use the code below:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
            <div class="warning">
              <p><strong>Security Notice:</strong> Never share this code with anyone. KEPlans will never ask for this code.</p>
            </div>
            <p style="margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>KEPlans Security</p>
            <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Password Reset Email Template
export function getPasswordResetEmailHTML(
  firstName: string,
  resetLink: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #002366 0%, #0047AB 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1d1d1f; font-size: 24px; margin: 0 0 16px; font-weight: 600; }
          .content p { color: #86868b; line-height: 1.6; margin: 0 0 20px; }
          .button { display: inline-block; background: #002366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 10px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .warning p { color: #856404; margin: 0; font-size: 14px; }
          .footer { padding: 30px; text-align: center; background: #f5f5f7; }
          .footer p { color: #86868b; font-size: 14px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello, ${firstName}!</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p style="margin-top: 20px; font-size: 14px; color: #86868b;">Or copy this link:<br>${resetLink}</p>
            <div class="warning">
              <p><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
          </div>
          <div class="footer">
            <p>KEPlans Security</p>
            <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
