import type { Metadata } from "next";
import AdminSignInForm from "@/components/admin/admin-signin-form";
import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";

export const metadata: Metadata = {
  title: "Admin Sign In - KEPlans",
  description: "Sign in to KEPlans admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-backgroundt p-4">
      <div className="absolute left-4 top-4">
        <Logo />
      </div>
      <div className="absolute right-4 top-4 ">
        <ThemeSwitcher col="text-primary" />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg sm:p-8">
        <AdminSignInForm />
      </div>
    </div>
  );
}
