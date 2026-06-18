"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/app/actions/auth";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);
    
    const result = await forgotPassword(formData);

    if (result.success) {
      setEmailSent(true);
    } else {
      toast.error(result.error || "Failed to send reset link");
    }
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="space-y-4 sm:space-y-5 text-center">
        <div className="flex justify-center">
          <CheckCircle className="size-16 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
            Check your email
          </h2>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Click the link in the email to reset your password.
          </p>
        </div>
        <Link href="/signin" className="inline-block">
          <Button className="h-10 gap-2 rounded-full max-sm:text-sm">
            Back to sign in
            <ArrowRight className="size-3.5 sm:size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Forgot password
        </h2>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Enter your email and we'll send a password reset link to continue.
        </p>
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
        disabled={loading}
        className="h-10 w-full gap-2 rounded-full cursor-pointer max-sm:text-sm"
      >
        {loading ? "Sending..." : "Send Reset Link"}
        <ArrowRight className="size-3.5 sm:size-4" />
      </Button>
    </form>
  );
}
