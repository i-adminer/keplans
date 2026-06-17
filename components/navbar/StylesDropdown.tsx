"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Home,
  Warehouse,
  Castle,
  Tent,
  Building,
  Palmtree,
  Mountain,
  Ship,
  House,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

import { buildPlansHref, styleValueFromLabel } from "@/lib/plans-filters";

interface HouseStyle {
  name: string;
  icon: LucideIcon;
  image: string;
}

const houseStyles: HouseStyle[] = [
  { name: "Modern", icon: Building2, image: "/api/placeholder/600/400" },
  { name: "Contemporary", icon: Building, image: "/api/placeholder/600/400" },
  { name: "Traditional", icon: Home, image: "/api/placeholder/600/400" },
  {
    name: "Modern Farmhouse",
    icon: Warehouse,
    image: "/api/placeholder/600/400",
  },
  { name: "Farmhouse", icon: House, image: "/api/placeholder/600/400" },
  { name: "Bungalow", icon: Palmtree, image: "/api/placeholder/600/400" },
  { name: "Cabin", icon: Mountain, image: "/api/placeholder/600/400" },
  { name: "Country", icon: Tent, image: "/api/placeholder/600/400" },
  { name: "Mediterranean", icon: Ship, image: "/api/placeholder/600/400" },
  { name: "Victorian", icon: Castle, image: "/api/placeholder/600/400" },
];

const StylesDropdown: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = React.useState<HouseStyle>(
    houseStyles[0],
  );
  const searchParams = useSearchParams();
  const plansHref = buildPlansHref(
    { style: styleValueFromLabel(selectedStyle.name) },
    searchParams.toString(),
  );

  return (
    <div className="bg-primary rounded-b-2xl text-white border-t border-white/10">
      <div className="w-full md:w-[75%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Styles Grid */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-4 ">House Styles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {houseStyles.map((style) => {
                const Icon = style.icon;
                return (
                  <button
                    key={style.name}
                    onClick={() => setSelectedStyle(style)}
                    className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg transition-all text-sm ${
                      selectedStyle.name === style.name
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-start">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Preview */}
          <div
            className="bg-primary/80 p-6 md:p-8 flex relative flex-col items-center justify-center border-l border-white/10 bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: "url('/herobg/hbg-1.jpg')",
              backgroundAttachment: "local",
            }}
          >
            <div className="absolute inset-0 bg-black/50 z-0" />

            <h4 className="text-3xl font-bold font-playfair mb-2 z-10">
              {selectedStyle.name} Style
            </h4>
            <p className="text-sm  mb-4 text-center z-10 font-playfair">
              Discover beautiful {selectedStyle.name.toLowerCase()} house
              designs tailored to your preferences.
            </p>
            <Link
              href={plansHref}
              className="flex items-center font-playfair z-10 cursor-pointer gap-2 bg-white text-primary px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Continue to Plans
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Styles Content
interface StylesMobileContentProps {
  onNavigate?: () => void;
}

const StylesMobileContent: React.FC<StylesMobileContentProps> = ({
  onNavigate,
}) => {
  const searchParams = useSearchParams();

  return (
    <div className="space-y-2">
      {houseStyles.map((style) => {
        const Icon = style.icon;
        return (
          <Link
            key={style.name}
            href={buildPlansHref(
              { style: styleValueFromLabel(style.name) },
              searchParams.toString(),
            )}
            onClick={onNavigate}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 w-full text-left text-sm"
          >
            <Icon className="size-4" />
            <span>{style.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default StylesDropdown;
export { StylesMobileContent, houseStyles };
export type { HouseStyle };
