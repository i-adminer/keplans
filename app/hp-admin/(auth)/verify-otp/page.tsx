import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import AdminVerifyOtpForm from "@/components/admin/admin-verify-otp-form";

export const metadata: Metadata = {
  title: "Admin Verify OTP | KEPlans",
  description: "Verify admin login code.",
};

export default async function AdminVerifyOtpPage() {
  return (
    <AuthShell
      eyebrow="4-digit code"
      title="Verify admin access"
      description="Enter the code we sent to your email to access the admin dashboard."
      points={[]}
    >
      <AdminVerifyOtpForm />
    </AuthShell>
  );
}
