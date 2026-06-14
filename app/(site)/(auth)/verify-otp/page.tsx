import type { Metadata } from "next";

import AuthShell from "@/components/auth/auth-shell";
import VerifyOtpForm from "@/components/auth/verify-otp-form";

type VerifyOtpPageProps = {
  searchParams: {
    flow?: string | string[];
  };
};

export const metadata: Metadata = {
  title: "Verify OTP | KEPlans",
  description: "Verify your one-time code.",
};

export default function VerifyOtpPage({ searchParams }: VerifyOtpPageProps) {
  const flowValue = Array.isArray(searchParams.flow)
    ? searchParams.flow[0]
    : searchParams.flow;
  const flow =
    flowValue === "signup" || flowValue === "reset" ? flowValue : "signin";

  return (
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
  );
}
