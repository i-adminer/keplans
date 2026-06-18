import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import VerifyOtpForm from "@/components/auth/verify-otp-form";
import { Suspense } from "react";

type VerifyOtpPageProps = {
  searchParams: Promise<{
    flow?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Verify OTP | KEPlans",
  description: "Verify your one-time code.",
};

export default async function VerifyOtpPage({ searchParams }: VerifyOtpPageProps) {
  const params = await searchParams;
  const flowValue = Array.isArray(params.flow)
    ? params.flow[0]
    : params.flow;
  const flow =
    flowValue === "signup" || flowValue === "reset" ? flowValue : "signin";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthShell
        eyebrow="6-digit code"
        title="Verify your access"
        description="We use a one-time code to keep your KEPlans account secure and ready for the next step."
        points={[
          "Works for sign in, sign up, and password recovery",
          "Paste the code or type it one box at a time",
          "Use resend if the email takes a moment to arrive",
        ]}
      >
        <VerifyOtpForm flow={flow} />
      </AuthShell>
    </Suspense>
  );
}
