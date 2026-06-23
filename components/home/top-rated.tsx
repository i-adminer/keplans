"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Trophy } from "lucide-react";
import TopRatedCard from "../products/rated";

interface Plan {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  bedrooms: number;
  baths: string;
  floors: number;
  sqft: number;
  rating?: string;
  reviewCount?: number;
  images?: Array<{ cloudinaryUrl: string }>;
}

interface RatedProps {
  plans: Plan[];
}

const Rated = ({ plans }: RatedProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  function scrollList(direction: -1 | 1) {
    listRef.current?.scrollBy({
      left: direction * 336,
      behavior: "smooth",
    });
  }

  const hasPlans = plans.length > 0;

  return (
    <div className="w-full py-12 px-5 bg-linear-to-b from-background to-muted/20">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 sm:size-7 text-yellow-500" />
            <div className="text-xl sm:text-3xl font-black bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Top Rated Plans
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Explore our most loved and highest-rated house plans</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollList(-1)}
            aria-label="Scroll top rated plans left"
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-yellow-200 bg-background text-foreground transition-all hover:scale-105 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollList(1)}
            aria-label="Scroll top rated plans right"
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-yellow-200 bg-background text-foreground transition-all hover:scale-105 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        className="mt-5 flex gap-3 overflow-x-auto scrollbar-none pb-5"
      >
        {hasPlans
          ? plans.map((plan) => (
              <div key={plan.id} className="shrink-0">
                <TopRatedCard plan={plan} />
              </div>
            ))
          : [...Array(12)].map((_, i) => (
              <div key={i} className="shrink-0">
                <TopRatedCard />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Rated;
