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
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/verify-otp?flow=signin");
      }}
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight font-playfair">
          Sign in
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Access your KEPlans account and continue where you left off.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-full gap-2 cursor-pointer"
        onClick={() => alert("A flower 🌹 for your hardwork!")}
      >
        <FcGoogle className="size-4" />
        Continue with Google
      </Button>

      <div className="relative py-1">
        <div className="h-px w-full bg-border" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          or email
        </span>
      </div>

      <div className="space-y-4">
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

        <label className="block space-y-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            Password
          </span>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
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
        className="h-11 w-full rounded-full gap-2 cursor-pointer"
      >
        Continue
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
