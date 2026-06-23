"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, Building, Heart, Ruler, Star } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/plans-filters";

// Matches the converted shape from the browser
interface PlanCardPlan {
  id: string;
  name: string;
  slug: string;
  style: string;
  bedrooms: number;
  baths: number;
  floors: number;
  sqft: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
  badge: string;
  summary: string;
  images: Array<{
    cloudinaryUrl: string;
    category: string;
    caption: string | null;
  }>;
}

interface PlanCardProps {
  plan: PlanCardPlan;
  styleLabel: string;
  onToggleFavorite: (planId: string) => void;
  isFavorite: boolean;
  isAdmin?: boolean;
}

export default function PlanCard({
  plan,
  styleLabel,
  onToggleFavorite,
  isFavorite,
  isAdmin = false,
}: PlanCardProps) {
  const imageUrl = plan.images?.[0]?.cloudinaryUrl || "/herobg/hbg-1.jpg";

  console.log(imageUrl);

  return (
    <Link
      href={
        isAdmin ? `/hp-admin/plans/${plan.id}/edit` : `/product/${plan.slug}`
      }
      aria-label={`View ${plan.name}`}
      className=" z-10 "
    >
      <article className="group relative mt-2 overflow-hidden rounded-xl bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative z-20">
          <div className="relative h-44 overflow-hidden">
            <Image
              src={imageUrl}
              alt={plan.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

            <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
              <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {styleLabel}
              </span>

              <button
                type="button"
                onClick={() => onToggleFavorite(plan.id)}
                className={`inline-flex size-10 items-center justify-center rounded-full border border-white/15 backdrop-blur-sm transition-all ${
                  isFavorite
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                    : "bg-black/55 text-white hover:bg-black/75"
                }`}
                aria-pressed={isFavorite}
                aria-label={`${isFavorite ? "Remove" : "Save"} ${plan.name}`}
              >
                <Heart
                  className={`size-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span>{plan.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({plan.reviewCount})
              </span>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold leading-tight line-clamp-1">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground line-clamp-2">
                    {plan.summary}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 ">
              <FeaturePill
                icon={Bed}
                label="Bd(s)"
                value={String(plan.bedrooms)}
              />
              <FeaturePill
                icon={Bath}
                label="Ba(s)"
                value={String(parseFloat(plan.baths))}
              />
              <FeaturePill
                icon={Building}
                label="Fl(s)"
                value={String(plan.floors)}
              />
              <FeaturePill icon={Ruler} label="Ft²" value={String(plan.sqft)} />
            </div>

            <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
              <div>
                <p className="text-base font-semibold text-green-500 flex gap-2">
                  <span>KES</span> <span>{formatMoney(plan.basePrice)}</span>
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.href = "/contact-us";
                }}
              >
                Request plan
              </Button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

interface FeaturePillProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function FeaturePill({ icon: Icon, label, value }: FeaturePillProps) {
  return (
    <div className="bg-muted/30 px-3 py-2 text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
      </div>
      <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
      <p className="text-xs"> {label}</p>
    </div>
  );
}
