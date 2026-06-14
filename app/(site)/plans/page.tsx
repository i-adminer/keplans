import type { Metadata } from "next";
import { Suspense } from "react";

import PlansBrowser from "@/components/plans/plans-browser";

export const metadata: Metadata = {
  title: "Browse House Plans - Filter by Style, Size & Budget",
  description: "Browse our complete collection of house plans. Filter by architectural style, bedrooms, square footage, and budget. Find the perfect floor plan for your dream home.",
  keywords: ["browse house plans", "filter floor plans", "house plans by style", "house plans by size", "affordable house plans"],
  openGraph: {
    title: "Browse House Plans - KEPlans",
    description: "Browse our complete collection of house plans. Filter by architectural style, bedrooms, square footage, and budget.",
    type: "website",
  },
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
