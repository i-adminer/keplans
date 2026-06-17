"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/signin?reset=success");
      }}
    >
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Reset password
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Create a new password for your KEPlans account.
        </p>
      </div>

      <label className="block space-y-1.5 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Lock className="size-3.5 text-muted-foreground sm:size-4" />
          New password
        </span>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="New password"
          required
          className="max-sm:h-8 max-sm:text-sm"
        />
      </label>

      <label className="block space-y-1.5 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Lock className="size-3.5 text-muted-foreground sm:size-4" />
          Confirm new password
        </span>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm new password"
          required
          className="max-sm:h-8 max-sm:text-sm"
        />
      </label>

      <div className="flex items-center justify-between gap-3 text-xs sm:gap-4 sm:text-sm">
        <Link href="/signin" className="text-muted-foreground hover:underline">
          Back to sign in
        </Link>
      </div>

      <Button type="submit" className="h-10 w-full gap-2 rounded-full max-sm:text-sm">
        Update password
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
