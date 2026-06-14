import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import SignInForm from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign In - Access Your Saved House Plans",
  description: "Sign in to your KEPlans account to access your saved house plans, favorites, and project notes. Secure authentication with email verification.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Secure access"
      title="Welcome back to KEPlans"
      description="Pick up your shortlist, saved plans, and project notes from where you left off."
      points={[
        "6-digit email verification after sign in",
        "Keep your favorite plans in one place",
        "Switch between devices without losing context",
      ]}
    >
      <SignInForm />
    </AuthShell>
  );
}
