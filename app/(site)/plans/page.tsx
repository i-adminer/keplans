import type { Metadata } from "next";
import { Suspense } from "react";

import PlansBrowser from "@/components/plans/plans-browser";

export const metadata: Metadata = {
  title: "Plans | KEPlans",
  description: "Browse KEPlans house plans by style, size, and budget.",
};

export default function Plans() {
  return (
    <main className="bg-background text-foreground pt-20">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <PlansBrowser />
      </Suspense>
    </main>
  );
}
