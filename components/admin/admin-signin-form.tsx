"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/app/actions/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);

    if (result.success) {
      if (result.requiresOTP) {
        toast({
          title: "OTP Sent!",
          description: "Check your email for the login code.",
        });
        const email = formData.get("email") as string;
        window.location.href = `/hp-admin/verify-otp?email=${encodeURIComponent(email)}`;
      } else {
        toast({
          title: "Success!",
          description: "Welcome to admin dashboard!",
        });
        window.location.href = "/hp-admin";
      }
    } else {
      toast({
        title: "Error",
        description: result.error || "Sign in failed",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
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
            name="email"
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
            name="password"
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
        disabled={loading}
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
      >
        {loading ? "Signing in..." : "Continue"}
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
