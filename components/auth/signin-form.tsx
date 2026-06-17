"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/verify-otp?flow=signin");
      }}
    >
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Sign in
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Access your KEPlans account and continue where you left off.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
        onClick={() => alert("A flower 🌹 for your hardwork!")}
      >
        <FcGoogle className="size-3.5 sm:size-4" />
        Continue with Google
      </Button>

      <div className="relative py-1">
        <div className="h-px w-full bg-border" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">
          or email
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4">
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

        <label className="block space-y-1.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Lock className="size-3.5 text-muted-foreground sm:size-4" />
            Password
          </span>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className="max-sm:h-8 max-sm:text-sm"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs sm:gap-4 sm:text-sm">
        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:underline"
        >
          Forgot password?
        </Link>
        <Link
          href="/signup"
          className="text-muted-foreground hover:text-foreground"
        >
          Don&apos;t have an account?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
      >
        Continue
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
