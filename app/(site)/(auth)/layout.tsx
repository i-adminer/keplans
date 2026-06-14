import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="mt-24 bg-backgroundt">{children}</div>;
}
