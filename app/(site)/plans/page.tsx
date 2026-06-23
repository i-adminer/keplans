import type { Metadata } from "next";
import { Suspense } from "react";

import { getPublishedPlans } from "@/app/actions/plans";
import PlansBrowserClient from "@/components/plans/plans-browser-client";

export const metadata: Metadata = {
  title: "Browse House Plans - Filter by Style, Size & Budget",
  description:
    "Browse our complete collection of house plans. Filter by architectural style, bedrooms, square footage, and budget. Find the perfect floor plan for your dream home.",
  keywords: [
    "browse house plans",
    "filter floor plans",
    "house plans by style",
    "house plans by size",
    "affordable house plans",
  ],
  openGraph: {
    title: "Browse House Plans - KEPlans",
    description:
      "Browse our complete collection of house plans. Filter by architectural style, bedrooms, square footage, and budget.",
    type: "website",
  },
};
export const revalidate = 60;

export default async function Plans() {
  const result = await getPublishedPlans();
  const plans: any = result.success ? result.plans : [];

  return (
    <main className="bg-background text-foreground pt-20">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <PlansBrowserClient plans={plans} />
      </Suspense>
    </main>
  );
}
