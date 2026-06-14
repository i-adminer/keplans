"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import RecentCard from "../products/recent-card";

const Recent = () => {
  const listRef = useRef<HTMLDivElement>(null);

  function scrollList(direction: -1 | 1) {
    listRef.current?.scrollBy({
      left: direction * 336,
      behavior: "smooth",
    });
  }

  return (
    <div className="w-full pt-12 px-5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-3xl tracking-wider font-realce text-outline">
          Most Recent Plans
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
            <RecentCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
