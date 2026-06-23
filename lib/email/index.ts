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
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  emailType,
  userId,
  replyTo,
}: SendEmailOptions) {
  // Check if email is configured
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD
  ) {
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
      ...(replyTo && { replyTo }),
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

// Contact Form Auto-Reply Template
export function getContactAutoReplyHTML(name: string): string {
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
            <h1>Message Received</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for reaching out to KEPlans! We've received your message and our team will review it shortly.</p>
            <p>We typically respond within 24 hours. For urgent inquiries, feel free to call us.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/plans" class="button">Browse Plans While You Wait</a>
            <p style="margin-top: 30px;">Best regards,<br>The KEPlans Team</p>
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

// Order Confirmation Email Template
export function getOrderConfirmationEmailHTML(data: {
  customerName: string;
  orderNumber: string;
  items: Array<{ planName: string; price: number; type: string }>;
  total: number;
}): string {
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
          .order-box { background: #f5f5f7; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e7; }
          .total { font-size: 20px; font-weight: 700; color: #16a34a; }
          .footer { padding: 30px; text-align: center; background: #f5f5f7; }
          .footer p { color: #86868b; font-size: 14px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <h2>Thank you, ${data.customerName}!</h2>
            <p>Your order has been confirmed and your plan documents are being prepared.</p>
            <div class="order-box">
              <p style="font-weight:600;margin:0 0 12px;">Order #${data.orderNumber}</p>
              ${data.items
                .map(
                  (item) => `
                <div class="order-item">
                  <span>${item.planName} (${item.type.toUpperCase()} Set)</span>
                  <span style="font-weight:600;">KES ${item.price.toLocaleString()}</span>
                </div>
              `,
                )
                .join("")}
              <div style="display:flex;justify-content:space-between;padding-top:12px;margin-top:8px;border-top:2px solid #e5e5e7;">
                <span style="font-weight:700;">Total</span>
                <span class="total">KES ${data.total.toLocaleString()}</span>
              </div>
            </div>
            <p>You will receive a separate email with download links for your plan documents within a few minutes.</p>
            <p style="margin-top: 30px;">Need help? Reply to this email or contact us.</p>
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


// Document Delivery Email with Download Links
export function getDocumentDeliveryEmailHTML(data: {
  customerName: string;
  orderNumber: string;
  items: Array<{
    planName: string;
    planNumber: string;
    type: string;
    documents: Array<{
      fileName: string;
      downloadUrl: string;
      documentType: string;
      fileSize: number;
    }>;
  }>;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1d1d1f; font-size: 24px; margin: 0 0 16px; font-weight: 600; }
          .content p { color: #86868b; line-height: 1.6; margin: 0 0 20px; }
          .plan-section { background: #f5f5f7; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .plan-section h3 { color: #002366; font-size: 18px; margin: 0 0 15px; }
          .doc-link { display: block; background: white; border: 2px solid #e5e5e7; border-radius: 8px; padding: 15px; margin: 10px 0; text-decoration: none; color: #1d1d1f; transition: all 0.2s; }
          .doc-link:hover { border-color: #002366; background: #f9fafb; }
          .doc-icon { display: inline-block; width: 40px; height: 40px; background: #002366; border-radius: 8px; text-align: center; line-height: 40px; color: white; font-weight: 700; margin-right: 12px; vertical-align: middle; font-size:12px; }
          .doc-info { display: inline-block; vertical-align: middle; }
          .doc-name { font-weight: 600; display: block; margin-bottom: 4px; }
          .doc-meta { font-size: 12px; color: #86868b; }
          .notice { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .notice p { color: #92400e; margin: 0; font-size: 14px; }
          .footer { padding: 30px; text-align: center; background: #f5f5f7; }
          .footer p { color: #86868b; font-size: 14px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Your Documents Are Ready!</h1>
          </div>
          <div class="content">
            <h2>Hello, ${data.customerName}!</h2>
            <p>Your house plan documents are ready for download. Click the links below to download your files.</p>
            <p><strong>Order:</strong> ${data.orderNumber}</p>
            
            ${data.items
              .map(
                (item) => `
              <div class="plan-section">
                <h3>${item.planName} ${item.planNumber ? `(#${item.planNumber})` : ""}</h3>
                <p style="margin:0 0 15px;color:#86868b;font-size:14px;">${item.type.toUpperCase()} Set</p>
                ${item.documents
                  .map(
                    (doc) => `
                  <a href="${doc.downloadUrl}" class="doc-link" target="_blank">
                    <span class="doc-icon">${doc.documentType.substring(0, 3).toUpperCase()}</span>
                    <div class="doc-info">
                      <span class="doc-name">${doc.fileName}</span>
                      <span class="doc-meta">${doc.documentType.toUpperCase()} • ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </a>
                `,
                  )
                  .join("")}
              </div>
            `,
              )
              .join("")}
            
            <div class="notice">
              <p><strong>⚠️ Important:</strong> These download links are permanent. Save them for future reference. For support, reply to this email anytime.</p>
            </div>
            
            <p style="margin-top:30px;">Thank you for choosing KEPlans. We're excited to be part of your building journey!</p>
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
