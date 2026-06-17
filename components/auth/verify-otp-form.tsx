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
            "Enter the 4-digit code we sent before you reset your password.",
          continueHref: "/reset-password",
        };
      case "signup":
        return {
          title: "Verify your account",
          description:
            "Confirm your email with the 4-digit code to activate your account.",
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

  const isComplete = code.replace(/\D/g, "").length === 4;

  console.log("FLOW: ", flow);

  return (
    <form
      className="w-full max-w-sm space-y-5 sm:space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isComplete) {
          return;
        }

        router.push(copy.continueHref);
      }}
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
          onClick={() => {
            setCode("");
            setResendLabel("Code resent");
            window.setTimeout(() => setResendLabel("Resend OTP"), 2500);
          }}
          className="inline-flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground"
        >
          <RefreshCcw className="size-3.5 sm:size-4" />
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
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
        disabled={!isComplete}
      >
        Continue
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
