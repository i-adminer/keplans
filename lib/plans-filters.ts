export type BedroomFilterValue = "1" | "2" | "3" | "4" | "5plus";
export type FloorFilterValue = "1" | "2" | "3" | "4plus";
export type AreaFilterValue = "under-100" | "100-200" | "200-300" | "300-plus";
export type SortValue = "recommended" | "price-asc" | "price-desc" | "rating-desc";

export interface PlansQueryState {
  style: string;
  bedrooms: BedroomFilterValue | "";
  floors: FloorFilterValue | "";
  area: AreaFilterValue | "";
  minPrice: number;
  maxPrice: number;
  sort: SortValue;
}

export interface PlanFiltersPatch {
  style?: string | null;
  bedrooms?: BedroomFilterValue | "" | null;
  floors?: FloorFilterValue | "" | null;
  area?: AreaFilterValue | "" | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: SortValue | null;
}

const DEFAULT_MAX_PRICE = 1_000_000;
const VALID_BEDROOM_FILTERS = new Set<BedroomFilterValue>([
  "1",
  "2",
  "3",
  "4",
  "5plus",
]);
const VALID_FLOOR_FILTERS = new Set<FloorFilterValue>(["1", "2", "3", "4plus"]);
const VALID_AREA_FILTERS = new Set<AreaFilterValue>([
  "under-100",
  "100-200",
  "200-300",
  "300-plus",
]);
const VALID_SORT_VALUES = new Set<SortValue>([
  "recommended",
  "price-asc",
  "price-desc",
  "rating-desc",
]);

type QuerySource =
  | { get(name: string): string | null }
  | Record<string, string | string[] | undefined>;

function readQueryValue(source: QuerySource, key: string): string | null {
  const getter = (source as { get?: unknown }).get;
  if (typeof getter === "function") {
    return getter.call(source, key) as string | null;
  }

  const value = (source as Record<string, string | string[] | undefined>)[key];
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function slugifyFilterValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function styleValueFromLabel(label: string): string {
  return slugifyFilterValue(label);
}

export function bedroomValueFromLabel(label: string): BedroomFilterValue | "" {
  const count = label.match(/\d+/)?.[0];
  if (!count) {
    return "";
  }

  const value = label.includes("+") ? `${count}plus` : count;
  return VALID_BEDROOM_FILTERS.has(value as BedroomFilterValue)
    ? (value as BedroomFilterValue)
    : "";
}

export function floorValueFromLabel(label: string): FloorFilterValue | "" {
  const count = label.match(/\d+/)?.[0];
  if (!count) {
    return "";
  }

  const value = label.includes("+") ? `${count}plus` : count;
  return VALID_FLOOR_FILTERS.has(value as FloorFilterValue)
    ? (value as FloorFilterValue)
    : "";
}

export function areaValueFromLabel(label: string): AreaFilterValue | "" {
  const normalized = label.toLowerCase();
  if (normalized.startsWith("under 100")) return "under-100";
  if (normalized.startsWith("100-200")) return "100-200";
  if (normalized.startsWith("200-300")) return "200-300";
  if (normalized.startsWith("300+")) return "300-plus";
  return "";
}

function parseBedroomFilter(value: string | null): BedroomFilterValue | "" {
  if (!value) return "";
  return VALID_BEDROOM_FILTERS.has(value as BedroomFilterValue)
    ? (value as BedroomFilterValue)
    : "";
}

function parseFloorFilter(value: string | null): FloorFilterValue | "" {
  if (!value) return "";
  return VALID_FLOOR_FILTERS.has(value as FloorFilterValue)
    ? (value as FloorFilterValue)
    : "";
}

function parseAreaFilter(value: string | null): AreaFilterValue | "" {
  if (!value) return "";
  return VALID_AREA_FILTERS.has(value as AreaFilterValue)
    ? (value as AreaFilterValue)
    : "";
}

function parseSortFilter(value: string | null): SortValue {
  if (!value) return "recommended";
  return VALID_SORT_VALUES.has(value as SortValue)
    ? (value as SortValue)
    : "recommended";
}

function parsePriceFilter(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function parsePlansQuery(source: QuerySource): PlansQueryState {
  const minPrice = parsePriceFilter(readQueryValue(source, "minPrice"), 0);
  const maxPrice = parsePriceFilter(
    readQueryValue(source, "maxPrice"),
    DEFAULT_MAX_PRICE,
  );

  return {
    style: slugifyFilterValue(readQueryValue(source, "style") ?? ""),
    bedrooms: parseBedroomFilter(readQueryValue(source, "bedrooms")),
    floors: parseFloorFilter(readQueryValue(source, "floors")),
    area: parseAreaFilter(readQueryValue(source, "area")),
    minPrice: Math.min(minPrice, maxPrice),
    maxPrice: Math.max(minPrice, maxPrice),
    sort: parseSortFilter(readQueryValue(source, "sort")),
  };
}

function updateParam(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined,
): void {
  if (value === undefined || value === null || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export function buildPlansHref(
  patch: PlanFiltersPatch,
  baseQuery = "",
): string {
  const params = new URLSearchParams(baseQuery);

  if (patch.style !== undefined) {
    updateParam(params, "style", patch.style ? slugifyFilterValue(patch.style) : "");
  }

  if (patch.bedrooms !== undefined) {
    updateParam(params, "bedrooms", patch.bedrooms);
  }

  if (patch.floors !== undefined) {
    updateParam(params, "floors", patch.floors);
  }

  if (patch.area !== undefined) {
    updateParam(params, "area", patch.area);
  }

  if (patch.minPrice !== undefined) {
    updateParam(
      params,
      "minPrice",
      patch.minPrice !== null && patch.minPrice > 0 ? patch.minPrice : "",
    );
  }

  if (patch.maxPrice !== undefined) {
    updateParam(
      params,
      "maxPrice",
      patch.maxPrice !== null && patch.maxPrice < DEFAULT_MAX_PRICE
        ? patch.maxPrice
        : "",
    );
  }

  if (patch.sort !== undefined) {
    updateParam(params, "sort", patch.sort === "recommended" ? "" : patch.sort);
  }

  const queryString = params.toString();
  return queryString ? `/plans?${queryString}` : "/plans";
}

export function formatMoney(value: number): string {
  return `KES ${value.toLocaleString("en-US")}`;
}

export function formatArea(value: number): string {
  return `${value.toLocaleString("en-US")}m²`;
}

export function matchesBedroomFilter(
  bedrooms: number,
  filter: BedroomFilterValue | "",
): boolean {
  if (!filter) return true;
  if (filter === "5plus") return bedrooms >= 5;
  return bedrooms === Number(filter);
}

export function matchesFloorFilter(
  floors: number,
  filter: FloorFilterValue | "",
): boolean {
  if (!filter) return true;
  if (filter === "4plus") return floors >= 4;
  return floors === Number(filter);
}

export function matchesAreaFilter(
  area: number,
  filter: AreaFilterValue | "",
): boolean {
  if (!filter) return true;

  switch (filter) {
    case "under-100":
      return area < 100;
    case "100-200":
      return area >= 100 && area < 200;
    case "200-300":
      return area >= 200 && area < 300;
    case "300-plus":
      return area >= 300;
    default:
      return true;
  }
}
