"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bed, Building, Ruler, ArrowRight } from "lucide-react";

import {
  bedroomValueFromLabel,
  buildPlansHref,
  areaValueFromLabel,
  floorValueFromLabel,
} from "@/lib/plans-filters";

interface SizeOptions {
  bedrooms: string[];
  floors: string[];
  areas: string[];
}

const bedrooms: string[] = [
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4 Bedrooms",
  "5+ Bedrooms",
];

const floors: string[] = ["1 Floor", "2 Floors", "3 Floors", "4+ Floors"];

const areas: string[] = ["Under 100 m²", "100-200 m²", "200-300 m²", "300+ m²"];

interface SizesDropdownProps {
  onNavigate?: () => void;
}

const SizesDropdown: React.FC<SizesDropdownProps> = ({ onNavigate }) => {
  const [selectedBedroom, setSelectedBedroom] = React.useState<string | null>(
    null,
  );
  const [selectedFloor, setSelectedFloor] = React.useState<string | null>(null);
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const plansHref = buildPlansHref(
    {
      ...(selectedBedroom ? { bedrooms: bedroomValueFromLabel(selectedBedroom) } : {}),
      ...(selectedFloor ? { floors: floorValueFromLabel(selectedFloor) } : {}),
      ...(selectedArea ? { area: areaValueFromLabel(selectedArea) } : {}),
    },
    searchParams.toString(),
  );

  return (
    <div className="bg-primary rounded-b-2xl text-white border-t border-white/10">
      <div className="w-full md:w-[75%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Filters */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bedrooms Column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bed className="size-4" />
                  <h4 className="font-semibold text-sm">Bedrooms</h4>
                </div>
                <div className="space-y-1">
                  {bedrooms.map((bedroom) => (
                    <button
                      key={bedroom}
                      onClick={() => setSelectedBedroom(bedroom)}
                      className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-all ${
                        selectedBedroom === bedroom
                          ? "bg-white/20 font-semibold"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {bedroom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floors Column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building className="size-4" />
                  <h4 className="font-semibold text-sm">Floors</h4>
                </div>
                <div className="space-y-1">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-all ${
                        selectedFloor === floor
                          ? "bg-white/20 font-semibold"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="size-4" />
                  <h4 className="font-semibold text-sm">Area (m²)</h4>
                </div>
                <div className="space-y-1">
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-all ${
                        selectedArea === area
                          ? "bg-white/20 font-semibold"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Preview/Summary */}
          <div
            className="bg-primary/80 p-6 md:p-8 flex flex-col font-playfair items-center justify-center relative  bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: "url('/herobg/hbg-2.jpg')",
              backgroundAttachment: "local",
            }}
          >
            <div className="absolute inset-0 bg-black/50 z-0" />

            <div className="text-center z-10 font-semibold">
              <h4 className="text-3xl font-semibold mb-4">Your Selection</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 justify-between">
                  <Bed className="size-4" />
                  <span className="text-gray-300">
                    {selectedBedroom || "Select bedrooms"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 ">
                  <Building className="size-4" />
                  <span className="text-gray-300">
                    {selectedFloor || "Select floors"}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <Ruler className="size-4" />
                  <span className="text-gray-300">
                    {selectedArea || "Select area"}
                  </span>
                </div>
              </div>
              <Link
                href={plansHref}
                onClick={onNavigate}
                className="flex items-center cursor-pointer gap-2 bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Find Plans
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Sizes Content
interface SizesMobileContentProps {
  onNavigate?: () => void;
}

const SizesMobileContent: React.FC<SizesMobileContentProps> = ({
  onNavigate,
}) => {
  const [section, setSection] = React.useState<string | null>(null);
  const [selectedBedroom, setSelectedBedroom] = React.useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = React.useState<string | null>(null);
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const plansHref = buildPlansHref(
    {
      ...(selectedBedroom ? { bedrooms: bedroomValueFromLabel(selectedBedroom) } : {}),
      ...(selectedFloor ? { floors: floorValueFromLabel(selectedFloor) } : {}),
      ...(selectedArea ? { area: areaValueFromLabel(selectedArea) } : {}),
    },
    searchParams.toString(),
  );

  return (
    <div className="space-y-2">
      <button
        onClick={() => setSection(section === "bedrooms" ? null : "bedrooms")}
        className="flex items-center gap-2 w-full text-left p-2 hover:bg-white/10 rounded"
      >
        <Bed className="size-4" /> Bedrooms
      </button>
      {section === "bedrooms" && (
        <div className="pl-6 space-y-1">
          {bedrooms.map((bed) => (
            <button
              key={bed}
              onClick={() => setSelectedBedroom(bed)}
              className={`block w-full text-left p-1 text-sm rounded ${
                selectedBedroom === bed ? "bg-white/20 font-semibold" : "hover:bg-white/10"
              }`}
            >
              {bed}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setSection(section === "floors" ? null : "floors")}
        className="flex items-center gap-2 w-full text-left p-2 hover:bg-white/10 rounded"
      >
        <Building className="size-4" /> Floors
      </button>
      {section === "floors" && (
        <div className="pl-6 space-y-1">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`block w-full text-left p-1 text-sm rounded ${
                selectedFloor === floor ? "bg-white/20 font-semibold" : "hover:bg-white/10"
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setSection(section === "area" ? null : "area")}
        className="flex items-center gap-2 w-full text-left p-2 hover:bg-white/10 rounded"
      >
        <Ruler className="size-4" /> Area
      </button>
      {section === "area" && (
        <div className="pl-6 space-y-1">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`block w-full text-left p-1 text-sm rounded ${
                selectedArea === area ? "bg-white/20 font-semibold" : "hover:bg-white/10"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      )}

      <Link
        href={plansHref}
        onClick={onNavigate}
        className="mt-3 flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-gray-100"
      >
        Find matching plans
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default SizesDropdown;
export { SizesMobileContent, bedrooms, floors, areas };
export type { SizeOptions };
