import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import SignUpForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - Create Your KEPlans Account",
  description: "Create your free KEPlans account to save house plans, create favorites lists, and access exclusive features. Quick and secure registration.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="New account"
      title="Create your KEPlans profile"
      description="Set up your account once, then save the plans that fit your plot, budget, and style."
      points={[
        "Start with email or continue with Google",
        "Verify your account with a 6-digit code",
        "Use the same profile for future plan requests",
      ]}
    >
      <SignUpForm />
    </AuthShell>
  );
}
