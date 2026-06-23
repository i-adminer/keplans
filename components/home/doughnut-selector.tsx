"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buildPlansHref } from "@/lib/plans-filters";
import type { BedroomFilterValue, FloorFilterValue } from "@/lib/plans-filters";

type Field = "bedrooms" | "floors";

type FieldConfig = {
  label: string;
  side: "top" | "bottom";
};

const fieldConfig: Record<Field, FieldConfig> = {
  bedrooms: { label: "Bedrooms", side: "top" },
  floors: { label: "floors", side: "bottom" },
};

type SelectorButtonProps = {
  field: Field;
  value: number | null;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (value: number) => void;
};

function SelectorButton({
  field,
  value,
  open,
  onOpen,
  onClose,
  onChange,
}: SelectorButtonProps) {
  const config = fieldConfig[field];
  const [draft, setDraft] = useState(value?.toString() ?? "0");

  function handleChange(val: string) {
    setDraft(val);

    const parsed = Number.parseInt(val, 10);

    if (Number.isFinite(parsed)) {
      onChange(parsed);
    }
  }

  return (
    <Popover open={open} onOpenChange={(next) => !next && onClose()}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "absolute inset-x-0 h-1/2 cursor-pointer transition-shadow hover:shadow-[0_0_6px_rgba(0,0,0,0.35)] border select-none",
            field === "bedrooms" ? "top-0 pb-7" : "bottom-0 pt-7",
          )}
          onClick={() => {
            setDraft((value ?? 0).toString());
            onOpen();
          }}
        >
          <span className="flex flex-col items-center gap-1 text-center select-none">
            <span className="font-realce sm:text-2xl text-sm font-semibold uppercase select-none">
              {config.label}, {value ?? 0}
            </span>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side={config.side}
        align="center"
        sideOffset={12}
        className="w-56 rounded-xl border border-border/70 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Enter number of {config.label}
            </p>

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Enter a value from 0 to 10+
          </p>

          {/* LIVE INPUT */}
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            className="h-10"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Helper to convert number to filter value
function bedroomToFilterValue(n: number): BedroomFilterValue | "" {
  if (n <= 0) return "";
  if (n >= 5) return "5plus";
  return String(n) as BedroomFilterValue;
}

function floorToFilterValue(n: number): FloorFilterValue | "" {
  if (n <= 0) return "";
  if (n >= 4) return "4plus";
  return String(n) as FloorFilterValue;
}

export function DonutSelector() {
  const router = useRouter();
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [floors, setFloors] = useState<number | null>(null);

  function openField(field: Field) {
    setActiveField(field);
  }

  function closeField() {
    setActiveField(null);
  }

  function handleGo() {
    const bedroomFilter = bedrooms ? bedroomToFilterValue(bedrooms) : "";
    const floorFilter = floors ? floorToFilterValue(floors) : "";

    const href = buildPlansHref({
      bedrooms: bedroomFilter || undefined,
      floors: floorFilter || undefined,
    });

    router.push(href);
  }

  return (
    <div className="relative sm:h-56 sm:w-56 h-40 w-40 rounded-full [clip-path:circle(50%)] bg-background">
      <SelectorButton
        field="bedrooms"
        value={bedrooms}
        open={activeField === "bedrooms"}
        onOpen={() => openField("bedrooms")}
        onClose={closeField}
        onChange={setBedrooms}
      />

      <SelectorButton
        field="floors"
        value={floors}
        open={activeField === "floors"}
        onOpen={() => openField("floors")}
        onClose={closeField}
        onChange={setFloors}
      />

      {/* Center GO button */}
      <button
        onClick={handleGo}
        className="absolute sm:inset-16 inset-12 z-30 flex cursor-pointer items-center select-none justify-center rounded-full bg-green-500 transition-colors hover:bg-green-400 active:bg-green-200"
      >
        <span className="font-realce sm:text-5xl max-sm:text-4xl font-black text-white select-none">
          GO
        </span>
      </button>
    </div>
  );
}
