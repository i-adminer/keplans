"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "@/app/actions/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);

    if (result.success) {
      toast({
        title: "Success!",
        description: "Account created! Please verify your email.",
      });
      const email = formData.get("email") as string;
      router.push(`/verify-otp?flow=signup&email=${encodeURIComponent(email)}`);
    } else {
      toast({
        title: "Error",
        description: result.error || "Signup failed",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Create account
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Set up your KEPlans account to save shortlist ideas and continue on
          any device.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            <User className="size-3.5 text-muted-foreground sm:size-4" />
            First name
          </span>
          <Input name="firstName" autoComplete="given-name" placeholder="First name" required className="max-sm:h-8 max-sm:text-sm" />
        </label>

        <label className="block space-y-1.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            <User className="size-3.5 text-muted-foreground sm:size-4" />
            Last name
          </span>
          <Input name="lastName" autoComplete="family-name" placeholder="Last name" required className="max-sm:h-8 max-sm:text-sm" />
        </label>
      </div>

      <label className="block space-y-1.5 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Mail className="size-3.5 text-muted-foreground sm:size-4" />
          Email address
        </span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="max-sm:h-8 max-sm:text-sm"
        />
      </label>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Lock className="size-3.5 text-muted-foreground sm:size-4" />
            Password
          </span>
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create password"
            required
            className="max-sm:h-8 max-sm:text-sm"
          />
        </label>

        <label className="block space-y-1.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Lock className="size-3.5 text-muted-foreground sm:size-4" />
            Confirm password
          </span>
          <Input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
            className="max-sm:h-8 max-sm:text-sm"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs sm:gap-4 sm:text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link href="/signin" className="text-muted-foreground hover:underline">
          Sign in
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
      >
        {loading ? "Creating account..." : "Continue"}
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
