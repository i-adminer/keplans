"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, RefreshCcw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";

type VerifyFlow = "signin" | "signup" | "reset";

interface VerifyOtpFormProps {
  flow: VerifyFlow;
}

export default function VerifyOtpForm({ flow }: VerifyOtpFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [resendLabel, setResendLabel] = useState("Resend OTP");
  const searchParam = useSearchParams();
  const flowurl = searchParam.get("flow");

  const copy = useMemo(() => {
    switch (flowurl) {
      case "reset":
        return {
          title: "Verify your email",
          description:
            "Enter the 6-digit code we sent before you reset your password.",
          continueHref: "/reset-password",
        };
      case "signup":
        return {
          title: "Verify your account",
          description:
            "Confirm your email with the 6-digit code to activate your account.",
          continueHref: "/plans",
        };
      default:
        return {
          title: "Verify sign in",
          description: "Enter the code we sent to finish signing in securely.",
          continueHref: "/plans",
        };
    }
  }, [flow]);

  const isComplete = code.replace(/\D/g, "").length === 6;

  console.log("FLOW: ", flow);

  return (
    <form
      className="space-y-6 w-88"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isComplete) {
          return;
        }

        router.push(copy.continueHref);
      }}
    >
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="size-4" />
          6-digit verification
        </div>
        <h2 className="text-3xl font-semibold tracking-tight font-playfair">
          {copy.title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.description}
        </p>
      </div>

      <OtpInput value={code} onChange={setCode} length={6} autoFocus />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={() => {
            setCode("");
            setResendLabel("Code resent");
            window.setTimeout(() => setResendLabel("Resend OTP"), 2500);
          }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RefreshCcw className="size-4" />
          {resendLabel}
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
        className="h-11 w-full rounded-full gap-2 cursor-pointer"
        disabled={!isComplete}
      >
        Continue
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
