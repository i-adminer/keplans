import { Bath, Bed, Building, Heart, Square, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

interface RecentCardProps {
  plan?: Plan;
}

const RecentCard = ({ plan }: RecentCardProps) => {
  // Show dummy if no plan provided
  if (!plan) {
    return (
      <div className="w-72 overflow-hidden rounded-t-2xl bg-background shadow-lg">
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
        <div className="space-y-3 p-3">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">Modern Family House</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.8 (120)</span>
            </div>
          </div>
          <div className="text-base font-bold text-green-600">KSh 120,000</div>
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>1 Bd(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>1 Ba(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Square className="h-4 w-4" />
              <span>220m²</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Building className="h-4 w-4" />
              <span>1 Fl(s)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/product/${plan.slug}`}>
      <div className="w-72 overflow-hidden rounded-t-2xl bg-background shadow-lg cursor-pointer">
        <div className="relative h-44 w-full overflow-hidden">
          {plan.images?.[0] ? (
            <Image
              src={plan.images?.[0].cloudinaryUrl}
              alt={plan.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-3">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">{plan.name}</h3>
            <div className="flex items-center gap-1.5 rounded-full  px-2 py-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700">{0}</span>
              <span className="text-xs text-muted-foreground">({0})</span>
            </div>
          </div>
          <div className="text-base font-bold text-green-600">
            KES {Number(plan.basePrice).toLocaleString()}
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{plan.bedrooms} Bd(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{parseFloat(plan.baths)} Ba(s)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{plan.sqft}m²</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{plan.floors} Fl(s)</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecentCard;
