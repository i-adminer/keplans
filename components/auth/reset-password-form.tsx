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
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/signin?reset=success");
      }}
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight font-playfair">
          Reset password
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Create a new password for your KEPlans account.
        </p>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Lock className="size-4 text-muted-foreground" />
          New password
        </span>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="New password"
          required
        />
      </label>

      <label className="block space-y-2 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Lock className="size-4 text-muted-foreground" />
          Confirm new password
        </span>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm new password"
          required
        />
      </label>

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href="/signin" className="text-muted-foreground hover:underline">
          Back to sign in
        </Link>
      </div>

      <Button type="submit" className="h-11 w-full rounded-full gap-2">
        Update password
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
