"use client";

import { ChevronRight } from "lucide-react";
import FamilyCard from "../products/family";

const Family = () => {
  return (
    <div className="relative w-full py-12 px-5 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage: "url('/herobg/hbg-2.jpg')",
        }}
      >
        <div className="inset-0 bg-black/50 absolute"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
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

        {/* Cards Grid - Responsive Layout */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 1,
              title: "Sunset Valley Home",
              price: "KES 185,000",
              beds: 4,
              baths: 3,
              area: "280m²",
              floors: 2,
              image: "/herobg/hbg-1.jpg",
              familyTag: "🏠 Perfect for Growing Families",
              memberCount: 5,
            },
            {
              id: 2,
              title: "Garden Paradise",
              price: "KES 210,000",
              beds: 5,
              baths: 4,
              area: "350m²",
              floors: 2,
              image: "/herobg/hbg-1.jpg",
              familyTag: "👨‍👩‍👧‍👦 Multi-Generational",
              memberCount: 6,
            },
            {
              id: 3,
              title: "Cozy Nest",
              price: "KES 145,000",
              beds: 3,
              baths: 2,
              area: "190m²",
              floors: 1,
              image: "/herobg/hbg-1.jpg",
              familyTag: "👶 Perfect for New Parents",
              memberCount: 3,
            },
            {
              id: 4,
              title: "Heritage Estate",
              price: "KES 325,000",
              beds: 6,
              baths: 5,
              area: "450m²",
              floors: 3,
              image: "/herobg/hbg-1.jpg",
              familyTag: "👑 Luxury Family Living",
              memberCount: 7,
            },
          ].map((item) => (
            <div key={item.id} className="flex justify-center">
              <FamilyCard {...item} />
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="mt-10 flex justify-center">
          <button className="group flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-lg">
            <span>See All Family Favorites</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Family;
