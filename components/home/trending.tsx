"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrendingCard from "../products/trending";
import TopRatedCard from "../products/rated";

const Trending = () => {
  const listRef = useRef<HTMLDivElement>(null);

  function scrollList(direction: -1 | 1) {
    listRef.current?.scrollBy({
      left: direction * 336,
      behavior: "smooth",
    });
  }

  return (
    <div className="bg-cyan-300  dark:bg-cyan-300/50 w-full pt-12 px-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl sm:text-3xl  font-black text-foreground">
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
        {[...Array(12)].map((_, i) => (
          <div key={i} className="shrink-0">
            <TrendingCard />
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center pb-5">
        <button className="group flex items-center gap-2 rounded-full border-2 border-yellow-50 bg-transparent px-6 py-2 font-semibold transition-all hover:bg-green-500 hover:text-white hover:shadow-lg cursor-pointer">
          View All Trending Plans
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default Trending;
