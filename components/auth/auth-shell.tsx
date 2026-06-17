import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  children: ReactNode;
}

export default function AuthShell({
  eyebrow,
  title,
  description,
  points,
  children,
}: AuthShellProps) {
  return (
    <div className=" bg-background text-foreground ">
      <main className="mx-auto flex w-full max-w-7xl items-center justify-center gap-6 px-3 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
        <section className="flex items-center lg:py-8">
          <div className="w-full rounded-md p-4 hover:shadow-[0_0_14px_rgb(0,0,0,0.2)] sm:p-8">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
