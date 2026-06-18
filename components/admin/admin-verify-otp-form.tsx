"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { verifyOTP, requestOTP } from "@/app/actions/auth";
import { toast } from "sonner";

export default function AdminVerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isComplete = code.replace(/\D/g, "").length === 4;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isComplete) return;

    setLoading(true);
    const result = await verifyOTP(code, "admin-login");

    if (result.success) {
      toast.success("Verified successfully!");
      window.location.href = "/hp-admin";
    } else {
      toast.error(result.error || "Verification failed");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    const result = await requestOTP("email_verification");

    if (result.success) {
      toast.success("New code sent!");
    } else {
      toast.error(result.error || "Failed to send code");
    }
    setResending(false);
  };

  return (
    <form className="w-full max-w-sm space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-600/10 px-3 py-1 text-[10px] font-medium text-green-600 sm:text-xs">
          <ShieldCheck className="size-3.5 sm:size-4" />
          4-digit verification
        </div>
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Verify admin login
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Enter the 4-digit code we sent to your email.
        </p>
      </div>

      <div className="flex w-full justify-center items-center">
        <OtpInput value={code} onChange={setCode} length={4} autoFocus />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground disabled:opacity-50"
        >
          <RefreshCcw className="size-3.5 sm:size-4" />
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>

      <Button
        type="submit"
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
        disabled={!isComplete || loading}
      >
        {loading ? "Verifying..." : "Continue"}
      </Button>
    </form>
  );
}
