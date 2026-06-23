"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, Building, Heart, Square, Star, Users } from "lucide-react";

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

interface FamilyCardProps {
  plan?: Plan;
}

const FamilyCard = ({ plan }: FamilyCardProps) => {
  // Dummy state
  if (!plan) {
    return (
      <div className="group relative w-full max-w-xs overflow-hidden rounded-tl-2xl rounded-br-2xl bg-background shadow-lg">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          <Users className="h-3 w-3" />
          <span>Family Pick</span>
        </div>
        <div className="absolute top-3 right-12 z-10 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm flex items-center gap-1">
          <Users className="size-4" />
          <span>500 members</span>
        </div>
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src="/herobg/hbg-1.jpg"
            alt="house plan"
            className="h-full w-full object-cover"
          />
          <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">Modern Family House</h3>
            <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700">4.9</span>
              <span className="text-xs text-muted-foreground">(2.3k)</span>
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-green-600">
              KES 120,000
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Bed className="h-4 w-4" />
              <span className="font-medium">3 Bd(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Bath className="h-4 w-4" />
              <span className="font-medium">2 Ba(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Square className="h-4 w-4" />
              <span className="font-medium">320m²</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Building className="h-4 w-4" />
              <span className="font-medium">2 Fl(s)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Real plan
  const rating = plan.rating ? Number(plan.rating).toFixed(1) : "4.8";
  const reviewCount = plan.reviewCount ?? 120;

  return (
    <Link href={`/product/${plan.slug}`}>
      <div className="group relative w-full max-w-xs overflow-hidden rounded-tl-2xl rounded-br-2xl bg-background shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
        {/* Family Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          <Users className="h-3 w-3" />
          <span>Family Pick</span>
        </div>

        {/* IMAGE */}
        <div className="relative h-44 w-full overflow-hidden">
          {plan.images?.[0] ? (
            <Image
              src={plan.images[0].cloudinaryUrl}
              alt={plan.name}
              fill
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-all hover:bg-black/60 hover:scale-110 cursor-pointer">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* INFO */}
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">{plan.name}</h3>
            <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700">
                {rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-green-600">
              KES {Number(plan.basePrice).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Bed className="h-4 w-4" />
              <span className="font-medium">{plan.bedrooms} Bd(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Bath className="h-4 w-4" />
              <span className="font-medium">{parseFloat(plan.baths)} Ba(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Square className="h-4 w-4" />
              <span className="font-medium">{plan.sqft}m²</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5">
              <Building className="h-4 w-4" />
              <span className="font-medium">{plan.floors} Fl(s)</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FamilyCard;
