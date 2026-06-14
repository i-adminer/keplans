"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  FilterX,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlanCard from "./plan-card";
import { planCatalog } from "@/lib/plans-data";
import {
  bedroomValueFromLabel,
  buildPlansHref,
  formatMoney,
  areaValueFromLabel,
  floorValueFromLabel,
  matchesAreaFilter,
  matchesBedroomFilter,
  matchesFloorFilter,
  parsePlansQuery,
  styleValueFromLabel,
} from "@/lib/plans-filters";
import { houseStyles } from "@/components/navbar/StylesDropdown";
import { bedrooms, floors, areas } from "@/components/navbar/SizesDropdown";
import { priceRanges } from "@/components/navbar/BudgetDropdown";
import Cta from "../home/cta";

const DEFAULT_STYLE = "";

export default function PlansBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const filters = useMemo(() => parsePlansQuery(searchParams), [searchParams]);

  const filteredPlans = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matched = planCatalog.filter((plan) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        plan.name.toLowerCase().includes(normalizedSearch) ||
        plan.summary.toLowerCase().includes(normalizedSearch) ||
        plan.badge.toLowerCase().includes(normalizedSearch) ||
        plan.style.toLowerCase().includes(normalizedSearch);

      return (
        matchesSearch &&
        (!filters.style || plan.style === filters.style) &&
        matchesBedroomFilter(plan.bedrooms, filters.bedrooms) &&
        matchesFloorFilter(plan.floors, filters.floors) &&
        matchesAreaFilter(plan.area, filters.area) &&
        plan.price >= filters.minPrice &&
        plan.price <= filters.maxPrice
      );
    });

    const sorted = [...matched].sort((left, right) => {
      switch (filters.sort) {
        case "price-asc":
          return left.price - right.price;
        case "price-desc":
          return right.price - left.price;
        case "rating-desc":
          return right.rating - left.rating;
        default:
          return (
            Number(right.featured) - Number(left.featured) ||
            right.reviews - left.reviews
          );
      }
    });

    return sorted;
  }, [
    filters.area,
    filters.bedrooms,
    filters.floors,
    filters.maxPrice,
    filters.minPrice,
    filters.sort,
    filters.style,
    searchTerm,
  ]);

  const selectedStyleLabel =
    houseStyles.find(
      (style) => styleValueFromLabel(style.name) === filters.style,
    )?.name ?? "All styles";

  const selectedBedroomLabel =
    bedrooms.find(
      (value) => bedroomValueFromLabel(value) === filters.bedrooms,
    ) ?? "All sizes";

  const selectedFloorLabel =
    floors.find((value) => floorValueFromLabel(value) === filters.floors) ??
    "All floors";

  const selectedAreaLabel =
    areas.find((value) => areaValueFromLabel(value) === filters.area) ??
    "All areas";

  const selectedPriceLabel =
    filters.minPrice === 0 && filters.maxPrice === 1_000_000
      ? "Any budget"
      : `${formatMoney(filters.minPrice)} - ${formatMoney(filters.maxPrice)}`;

  function applyFilters(nextFilters: typeof filters) {
    startTransition(() => {
      router.replace(buildPlansHref(nextFilters, searchParams.toString()), {
        scroll: false,
      });
    });
  }

  function updateFilter<K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) {
    applyFilters({ ...filters, [key]: value });
  }

  function resetFilters() {
    setSearchTerm("");
    applyFilters({
      style: DEFAULT_STYLE,
      bedrooms: "",
      floors: "",
      area: "",
      minPrice: 0,
      maxPrice: 1_000_000,
      sort: "recommended",
    });
  }

  function toggleFavorite(planId: string) {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(planId)) {
        next.delete(planId);
      } else {
        next.add(planId);
      }
      return next;
    });
  }

  const visibleCount = filteredPlans.length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 border-b border-border/60 py-8 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:items-end lg:py-10">
        <div className="space-y-5">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl font-realce">
              Browse plans by style, size, and budget
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base font-playfair">
              Explore our entire collection of house plans, easily filtered by
              style, size, and budget to find your perfect match.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <a href="/contact-us">Need a hand?</a>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="filters"
        className="grid gap-6 py-8 lg:grid-cols-[320px_minmax(0,1fr)]"
      >
        <aside className="lg:sticky lg:top-24 self-start space-y-5 shadow-[0_0_14px_rgb(0,0,0,0.3)] dark:shadow-[0_0_14px_rgb(0,0,0,0.5)] bg-background/90 p-4 border-r backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Filter plans</h2>
              <p className="text-sm text-muted-foreground">
                customize your needs...
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="rounded-full cursor-pointer"
            >
              <FilterX className="size-4" />
              Reset
            </Button>
          </div>

          <div className="space-y-3 shadow-[0_0_14px_rgb(0,0,0,0.2)]  bg-muted/20 p-3">
            <label
              className="flex items-center gap-2 text-sm font-medium"
              htmlFor="plan-search"
            >
              <Search className="size-4 text-muted-foreground" />
              Search plans
            </label>
            <Input
              id="plan-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Modern, family, coastal..."
              className="rounded-full bg-background"
            />
          </div>

          <FilterSection title="Styles" description={selectedStyleLabel}>
            <div className="grid max-h-72 gap-2 overflow-auto pr-1">
              {houseStyles.map((style) => {
                const isActive =
                  filters.style === styleValueFromLabel(style.name);
                const Icon = style.icon;

                return (
                  <Button
                    key={style.name}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start gap-2 rounded-2xl"
                    onClick={() =>
                      updateFilter(
                        "style",
                        isActive ? "" : styleValueFromLabel(style.name),
                      )
                    }
                  >
                    <Icon className="size-4" />
                    <span>{style.name}</span>
                  </Button>
                );
              })}
            </div>
          </FilterSection>

          <FilterSection
            title="Sizes"
            description={`${selectedBedroomLabel} · ${selectedFloorLabel} · ${selectedAreaLabel}`}
          >
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Bedrooms
                </p>
                <div className="flex flex-wrap gap-2">
                  {bedrooms.map((bedroomLabel) => {
                    const value = bedroomValueFromLabel(bedroomLabel);
                    const isActive = filters.bedrooms === value;

                    return (
                      <Button
                        key={bedroomLabel}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="xs"
                        className="rounded-full"
                        onClick={() =>
                          updateFilter("bedrooms", isActive ? "" : value)
                        }
                      >
                        {bedroomLabel}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Floors
                </p>
                <div className="flex flex-wrap gap-2">
                  {floors.map((floorLabel) => {
                    const value = floorValueFromLabel(floorLabel);
                    const isActive = filters.floors === value;

                    return (
                      <Button
                        key={floorLabel}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="xs"
                        className="rounded-full"
                        onClick={() =>
                          updateFilter("floors", isActive ? "" : value)
                        }
                      >
                        {floorLabel}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Area
                </p>
                <div className="flex flex-wrap gap-2">
                  {areas.map((areaLabel) => {
                    const value = areaValueFromLabel(areaLabel);
                    const isActive = filters.area === value;

                    return (
                      <Button
                        key={areaLabel}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="xs"
                        className="rounded-full"
                        onClick={() =>
                          updateFilter("area", isActive ? "" : value)
                        }
                      >
                        {areaLabel}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Budget" description={selectedPriceLabel}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {priceRanges.map((range) => {
                  const isActive =
                    filters.minPrice === range.min &&
                    filters.maxPrice === range.max;

                  return (
                    <Button
                      key={range.label}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      size="xs"
                      className="rounded-2xl"
                      onClick={() =>
                        applyFilters({
                          ...filters,
                          minPrice: range.min,
                          maxPrice: range.max,
                        })
                      }
                    >
                      {range.label}
                    </Button>
                  );
                })}
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-background p-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Minimum</span>
                    <span>{formatMoney(filters.minPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={filters.minPrice}
                    onChange={(event) =>
                      updateFilter("minPrice", Number(event.target.value))
                    }
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Maximum</span>
                    <span>{formatMoney(filters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      updateFilter("maxPrice", Number(event.target.value))
                    }
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Sort by" description={filters.sort}>
            <select
              value={filters.sort}
              onChange={(event) =>
                updateFilter("sort", event.target.value as typeof filters.sort)
              }
              className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus:border-ring"
            >
              <option value="recommended">Recommended</option>
              <option value="rating-desc">Highest rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </FilterSection>
        </aside>

        <div className="space-y-4">
          {visibleCount === 0 ? (
            <div className="rounded-3xl  bg-muted/20 p-10 text-center">
              <Sparkles className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">
                No plans match these filters
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a wider budget, a different style, or clear the filters to
                bring the collection back.
              </p>
              <Button
                type="button"
                className="mt-6 rounded-full"
                onClick={resetFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <ScrollArea className="lg:h-[calc(100vh)]">
              <div className="grid gap-4 pr-4 sm:grid-cols-2 xl:grid-cols-3 py-3">
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    styleLabel={
                      houseStyles.find(
                        (style) =>
                          styleValueFromLabel(style.name) === plan.style,
                      )?.name ?? plan.style
                    }
                    isFavorite={favoriteIds.has(plan.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </section>

      <Cta />
    </div>
  );
}

function FilterSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-3 shadow-[0_0_14px_rgb(0,0,0,0.2)] bg-background p-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm text-foreground">{description}</p>
        </div>
        <ChevronDown
          className={`size-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pt-2">{children}</div>}
    </section>
  );
}

function ActiveChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
      {label}
    </span>
  );
}
