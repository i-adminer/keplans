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
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/verify-otp?flow=reset");
      }}
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight font-playfair">
          Forgot password
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Enter your email and we’ll send a one-time code to continue.
        </p>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Mail className="size-4 text-muted-foreground" />
          Email address
        </span>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <div className="flex items-center justify-between gap-4 text-sm">
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
        className="h-11 w-full rounded-full gap-2 cursor-pointer"
      >
        Send OTP
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
