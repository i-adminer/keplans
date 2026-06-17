"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DollarSign, SlidersHorizontal, ArrowRight } from "lucide-react";

import { buildPlansHref } from "@/lib/plans-filters";

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const priceRanges: PriceRange[] = [
  { label: "Under 50,000", min: 0, max: 50000 },
  { label: "50,000 - 100,000", min: 50000, max: 100000 },
  { label: "100,000 - 200,000", min: 100000, max: 200000 },
  { label: "200,000 - 300,000", min: 200000, max: 300000 },
  { label: "300,000 - 500,000", min: 300000, max: 500000 },
  { label: "500,000+", min: 500000, max: 1000000 },
];

const BudgetDropdown: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    100000, 400000,
  ]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const maxBudget: number = 1000000;
  const searchParams = useSearchParams();

  const handlePresetClick = (preset: PriceRange): void => {
    setSelectedPreset(preset.label);
    setPriceRange([preset.min, preset.max]);
  };

  const handleSliderChange = (index: number, value: string): void => {
    const newValue = parseInt(value);
    const newRange: [number, number] = [...priceRange];
    newRange[index] = newValue;

    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }

    setPriceRange(newRange);
    setSelectedPreset(null);
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  };

  return (
    <div className="bg-primary text-white border-t border-white/10">
      <div className="w-full md:w-[75%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Budget Filters */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-6">Set Your Budget</h3>

            {/* Preset Price Ranges */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePresetClick(range)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                    selectedPreset === range.label
                      ? "bg-white/20 font-semibold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <DollarSign className="size-4" />
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Slider */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                <span className="text-sm font-semibold">Custom Range</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs text-gray-300 mb-1 block">
                    Minimum: {formatPrice(priceRange[0])}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxBudget}
                    step="10000"
                    value={priceRange[0]}
                    onChange={(e) => handleSliderChange(0, e.target.value)}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 mb-1 block">
                    Maximum: {formatPrice(priceRange[1])}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxBudget}
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => handleSliderChange(1, e.target.value)}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-300 mt-2">
                <span>$0</span>
                <span>$500K</span>
                <span>$1M</span>
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div
            className="bg-primary/80 p-6 md:p-8 flex flex-col items-center relative  font-playfair justify-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/herobg/hbg-2.jpg')",
              backgroundAttachment: "local",
            }}
          >
            <div className="absolute inset-0 bg-black/50 z-0" />
            <div className="text-center z-10">
              <h4 className="text-3xl font-semibold mb-4">Your Budget</h4>
              <div className="text-2xl font-bold mb-2">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {selectedPreset || "Custom Range"}
              </p>

              <div className="w-full bg-white/30 rounded-full h-4 mb-6 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{
                    marginLeft: `${(priceRange[0] / maxBudget) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / maxBudget) * 100}%`,
                  }}
                />
              </div>

              <Link
                href={buildPlansHref(
                  { minPrice: priceRange[0], maxPrice: priceRange[1] },
                  searchParams.toString(),
                )}
                className="flex items-center gap-2 bg-white text-primary px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                View Plans in Budget
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Budget Content
interface BudgetMobileContentProps {
  onNavigate?: () => void;
}

const BudgetMobileContent: React.FC<BudgetMobileContentProps> = ({
  onNavigate,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    100000, 400000,
  ]);
  const searchParams = useSearchParams();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1">
        {priceRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => setPriceRange([range.min, range.max])}
            className="text-left p-1 text-xs hover:bg-white/10 rounded"
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-xs">
          Min: ${priceRange[0].toLocaleString()}
        </label>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange([parseInt(e.target.value), priceRange[1]])
          }
          className="w-full"
        />
        <label className="text-xs">
          Max: ${priceRange[1].toLocaleString()}
        </label>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full"
        />
      </div>

      <Link
        href={buildPlansHref(
          { minPrice: priceRange[0], maxPrice: priceRange[1] },
          searchParams.toString(),
        )}
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-gray-100"
      >
        View matching plans
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default BudgetDropdown;
export { BudgetMobileContent, priceRanges };
export type { PriceRange };
