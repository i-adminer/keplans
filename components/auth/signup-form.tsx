"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";

export default function SignUpForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/verify-otp?flow=signup");
      }}
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight font-playfair">
          Create account
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Set up your KEPlans account to save shortlist ideas and continue on
          any device.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-full gap-2 cursor-pointer"
        onClick={() => alert("A flower 🌹 for you hardwork!")}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            First name
          </span>
          <Input autoComplete="given-name" placeholder="First name" required />
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            Last name
          </span>
          <Input autoComplete="family-name" placeholder="Last name" required />
        </label>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            Password
          </span>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="Create password"
            required
          />
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            Confirm password
          </span>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link href="/signin" className="text-muted-foreground hover:underline">
          Sign in
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
