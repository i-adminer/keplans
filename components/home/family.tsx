"use client";

import { ChevronRight } from "lucide-react";
import FamilyCard from "../products/family";

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

interface FamilyProps {
  plans: Plan[];
}

const Family = ({ plans }: FamilyProps) => {
  const hasPlans = plans.length > 0;

  return (
    <div className="relative w-full py-12 px-5 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage: "url('/herobg/hbg-2.jpg')",
        }}
      >
        <div className="inset-0 bg-black/50 absolute"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div>
            <div className="text-4xl font-black font-pacifico">
              <span className="bg-linear-to-r from-white to-white bg-clip-text text-transparent drop-shadow-lg">
                Family Collections
              </span>
            </div>
            <div className="font-playfair mt-2 text-white drop-shadow-md font-semibold">
              Happy & proud families came for these plans.
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {hasPlans
            ? plans
                .slice(0, 8)
                .map((plan) => <FamilyCard key={plan.id} plan={plan} />)
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-center">
                  <FamilyCard />
                </div>
              ))}
        </div>

        {hasPlans && plans.length > 8 && (
          <div className="mt-10 flex justify-center">
            <button className="group flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-lg">
              <span>See All Family Favorites</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Family;
