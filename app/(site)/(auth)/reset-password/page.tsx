import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | KEPlans",
  description: "Set a new KEPlans password.",
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
