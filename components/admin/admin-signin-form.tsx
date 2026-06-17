"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSignInForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/hp-admin/verify-otp");
      }}
    >
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Admin Sign In
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Access KEPlans admin dashboard securely.
        </p>
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
            placeholder="admin@keplans.com"
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
