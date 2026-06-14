import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | KEPlans",
  description: "Reset your KEPlans password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset access securely"
      description="Send a verification code to your email, then create a new password without losing your account."
      points={[
        "Email your recovery code first",
        "Resend the code when needed",
        "Return to sign in after the reset is complete",
      ]}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
