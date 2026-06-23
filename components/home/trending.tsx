"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrendingCard from "../products/trending";

interface Plan {
  id: string;
  name: string;
  slug: string;
  style: string;
  basePrice: string;
  bedrooms: number;
  baths: string;
  floors: number;
  sqft: number;
  images?: Array<{ cloudinaryUrl: string }>;
}

interface TrendingProps {
  plans: Plan[];
}

const Trending = ({ plans }: TrendingProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  function scrollList(direction: -1 | 1) {
    listRef.current?.scrollBy({
      left: direction * 336,
      behavior: "smooth",
    });
  }

  const hasPlans = plans.length > 0;

  return (
    <div className="bg-cyan-300 dark:bg-cyan-300/50 w-full pt-12 px-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl sm:text-3xl font-black text-foreground">
            Trending now! ✨
          </div>
          <div className="max-sm:text-sm">
            Explore these most clicked plans to discover secrets.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollList(-1)}
            aria-label="Scroll recent plans left"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollList(1)}
            aria-label="Scroll recent plans right"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={listRef}
        className="mt-5 flex gap-3 overflow-x-auto scrollbar-none pb-5"
      >
        {hasPlans ? (
          plans.map((plan) => (
            <div key={plan.id} className="shrink-0">
              <TrendingCard plan={plan} />
            </div>
          ))
        ) : (
          [...Array(12)].map((_, i) => (
            <div key={i} className="shrink-0">
              <TrendingCard />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Trending;
