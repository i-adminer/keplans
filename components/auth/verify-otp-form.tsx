"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { verifyOTP, requestOTP } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";

type VerifyFlow = "signin" | "signup" | "reset";

interface VerifyOtpFormProps {
  flow: VerifyFlow;
}

export default function VerifyOtpForm({ flow }: VerifyOtpFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const searchParam = useSearchParams();
  const flowurl = searchParam.get("flow");

  const copy = useMemo(() => {
    switch (flowurl) {
      case "reset":
        return {
          title: "Verify your email",
          description:
            "Enter the 4-digit code we sent before you reset your password.",
          continueHref: "/reset-password",
          purpose: "password-reset" as const,
        };
      case "signup":
        return {
          title: "Verify your account",
          description:
            "Confirm your email with the 4-digit code to activate your account.",
          continueHref: "/",
          purpose: "email-verification" as const,
        };
      default:
        return {
          title: "Verify sign in",
          description: "Enter the 4-digit code we sent to finish signing in securely.",
          continueHref: "/",
          purpose: "email-verification" as const,
        };
    }
  }, [flowurl]);

  const isComplete = code.replace(/\D/g, "").length === 4;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isComplete) return;

    setLoading(true);
    const purpose = copy.purpose === "password-reset" ? "password-reset" : "email-verification";
    const result = await verifyOTP(code, purpose);

    if (result.success) {
      toast({
        title: "Success!",
        description: "Verified successfully!",
      });
      
      // Force reload to update auth state
      window.location.href = copy.continueHref;
    } else {
      toast({
        title: "Error",
        description: result.error || "Verification failed",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    const purpose = copy.purpose === "password-reset" ? "password_change" : "email_verification";
    const result = await requestOTP(purpose);

    toast({
      title: result.success ? "Success!" : "Error",
      description: result.success ? "New code sent!" : (result.error || "Failed to send code"),
      variant: result.success ? "default" : "destructive",
    });
    setResending(false);
  };

  return (
    <form
      className="w-full max-w-sm space-y-5 sm:space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-600/10 px-3 py-1 text-[10px] font-medium text-green-600 sm:text-xs">
          <ShieldCheck className="size-3.5 sm:size-4" />
          4-digit verification
        </div>
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          {copy.title}
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          {copy.description}
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

        <Link
          href="/signin"
          className={`${flowurl === "signup" && "hidden"} text-muted-foreground hover:underline `}
        >
          Use a different email
        </Link>
      </div>

      <Button
        type="submit"
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
        disabled={!isComplete || loading}
      >
        {loading ? "Verifying..." : "Continue"}
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
