import type { Metadata } from "next";
import AdminVerifyOtpForm from "@/components/admin/admin-verify-otp-form";
import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";

export const metadata: Metadata = {
  title: "Verify OTP - Admin Portal",
  description: "Verify your admin access code.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminVerifyOtpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-backgroundt p-4">
      <div className="absolute left-4 top-4">
        <Logo />
      </div>
      <div className="absolute right-4 top-4">
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg sm:p-8">
        <AdminVerifyOtpForm />
      </div>
    </div>
  );
}
