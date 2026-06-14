"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Trophy } from "lucide-react";
import TopRatedCard from "../products/rated";
const Rated = () => {
  const listRef = useRef<HTMLDivElement>(null);

  function scrollList(direction: -1 | 1) {
    listRef.current?.scrollBy({
      left: direction * 336,
      behavior: "smooth",
    });
  }

  return (
    <div className="w-full py-12 px-5 bg-linear-to-b from-background to-muted/20">
      {/* Header Section with Enhanced Rating Theme */}
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

        {/* Navigation Buttons with Rating Theme */}
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

      {/* Rating Stats Bar - Unique to Rated Section */}
      <div className="mt-4 flex items-center gap-6 rounded-lg p-3 px-4 max-sm:hidden">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm font-semibold">4.9/5</span>
        </div>
        <div className="h-4 w-px bg-yellow-200" />
        <div className="text-sm text-muted-foreground">
          Based on <span className="font-semibold text-yellow-700">2,847</span>{" "}
          verified reviews
        </div>
        <div className="h-4 w-px bg-yellow-200" />
        <div className="text-sm text-muted-foreground">
          ⭐ <span className="font-semibold">Top 1%</span> of all listings
        </div>
      </div>

      {/* Cards Carousel */}
      <div
        ref={listRef}
        className="mt-5 flex gap-5 overflow-x-auto scrollbar-none pb-5"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="shrink-0 transition-all duration-300 hover:-translate-y-1"
          >
            <TopRatedCard />
          </div>
        ))}
      </div>

      {/* View All Link - Premium Touch */}
      <div className="mt-8 flex justify-center">
        <button className="group flex items-center gap-2 rounded-full border-2 border-yellow-300 bg-transparent px-6 py-2 font-semibold text-yellow-700 transition-all hover:bg-yellow-500 hover:text-white hover:shadow-lg cursor-pointer">
          View All Top Rated Plans
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default Rated;
