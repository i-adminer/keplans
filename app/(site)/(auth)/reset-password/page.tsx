import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Create New Password",
  description: "Create a new password for your KEPlans account. Enter the verification code sent to your email and choose a secure password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="New password"
      title="Create a stronger password"
      description="Finish recovery by setting a password you can use on your next sign in."
      points={[
        "Confirm the new password before saving",
        "Return to sign in when done",
        "Keep the same account and saved plans",
      ]}
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
