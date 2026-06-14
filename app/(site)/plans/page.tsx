import type { Metadata } from "next";

import PlansBrowser from "@/components/plans/plans-browser";

export const metadata: Metadata = {
  title: "Plans | KEPlans",
  description: "Browse KEPlans house plans by style, size, and budget.",
};

export default function Plans() {
  return (
    <main className="bg-background text-foreground pt-20">
      <PlansBrowser />
    </main>
  );
}
