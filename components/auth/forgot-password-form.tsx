"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/verify-otp?flow=reset");
      }}
    >
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Forgot password
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Enter your email and we’ll send a one-time code to continue.
        </p>
      </div>

      <label className="block space-y-1.5 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Mail className="size-3.5 text-muted-foreground sm:size-4" />
          Email address
        </span>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="max-sm:h-8 max-sm:text-sm"
        />
      </label>

      <div className="flex items-center justify-between gap-3 text-xs sm:gap-4 sm:text-sm">
        <Link href="/signin" className="text-muted-foreground hover:underline">
          Back to sign in
        </Link>
        <Link
          href="/signup"
          className="text-muted-foreground hover:text-foreground"
        >
          Create account
        </Link>
      </div>

      <Button
        type="submit"
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
      >
        Send OTP
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
