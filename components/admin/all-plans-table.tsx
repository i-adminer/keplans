"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  publishPlan,
  unpublishPlan,
  deletePlan as deletePlanAction,
} from "@/app/actions/plans";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HOUSE_STYLES = [
  "Modern",
  "Contemporary",
  "Traditional",
  "Modern Farmhouse",
  "Farmhouse",
  "Bungalow",
  "Cabin",
  "Country",
  "Mediterranean",
  "Victorian",
];

const ITEMS_PER_PAGE = 10;

interface Plan {
  id: string;
  name: string;
  planNumber: string;
  style: string;
  basePrice: string;
  bedrooms: number;
  baths: string;
  floors: number;
  sqft: number;
  published: boolean;
  featured: boolean;
  images?: Array<{
    id: string;
    cloudinaryUrl: string;
    category: string;
    caption: string | null;
  }>;
}

interface AllPlansTableProps {
  plans: Plan[];
}

export default function AllPlansTable({ plans }: AllPlansTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [bedroomsFilter, setBedroomsFilter] = useState("");
  const [floorsFilter, setFloorsFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Filter logic
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Search
      if (
        searchQuery &&
        !plan.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !plan.planNumber.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Style
      if (styleFilter && plan.style !== styleFilter) return false;

      // Bedrooms
      if (bedroomsFilter) {
        if (bedroomsFilter === "5plus" && plan.bedrooms < 5) return false;
        if (
          bedroomsFilter !== "5plus" &&
          plan.bedrooms !== Number(bedroomsFilter)
        )
          return false;
      }

      // Floors
      if (floorsFilter) {
        if (floorsFilter === "4plus" && plan.floors < 4) return false;
        if (floorsFilter !== "4plus" && plan.floors !== Number(floorsFilter))
          return false;
      }

      // Area
      if (areaFilter) {
        const area = plan.sqft;
        if (areaFilter === "under-100" && area >= 100) return false;
        if (areaFilter === "100-200" && (area < 100 || area >= 200))
          return false;
        if (areaFilter === "200-300" && (area < 200 || area >= 300))
          return false;
        if (areaFilter === "300-plus" && area < 300) return false;
      }

      // Status
      if (statusFilter === "published" && !plan.published) return false;
      if (statusFilter === "unpublished" && plan.published) return false;
      if (statusFilter === "featured" && !plan.featured) return false;

      return true;
    });
  }, [
    plans,
    searchQuery,
    styleFilter,
    bedroomsFilter,
    floorsFilter,
    areaFilter,
    statusFilter,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlans = filteredPlans.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Actions
  const togglePublish = async (id: string, currentStatus: boolean) => {
    setLoadingPlanId(id);
    const result = currentStatus
      ? await unpublishPlan(id)
      : await publishPlan(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update plan");
    }
    setLoadingPlanId(null);
  };

  const handleDeletePlan = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this plan? This will also delete all associated images and documents.",
      )
    ) {
      return;
    }

    setLoadingPlanId(id);
    const result = await deletePlanAction(id);

    if (result.success) {
      toast.success("Plan deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete plan");
    }
    setLoadingPlanId(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStyleFilter("");
    setBedroomsFilter("");
    setFloorsFilter("");
    setAreaFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    styleFilter ||
    bedroomsFilter ||
    floorsFilter ||
    areaFilter ||
    statusFilter;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              <X className="size-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-2 block text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Plan name or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 pl-9"
              />
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="mb-2 block text-sm font-medium">Style</label>
            <select
              value={styleFilter}
              onChange={(e) => {
                setStyleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">All Styles</option>
              {HOUSE_STYLES.map((style) => (
                <option
                  key={style}
                  value={style.toLowerCase().replace(/\s+/g, "-")}
                >
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="mb-2 block text-sm font-medium">Bedrooms</label>
            <select
              value={bedroomsFilter}
              onChange={(e) => {
                setBedroomsFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5plus">5+</option>
            </select>
          </div>

          {/* Floors */}
          <div>
            <label className="mb-2 block text-sm font-medium">Floors</label>
            <select
              value={floorsFilter}
              onChange={(e) => {
                setFloorsFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4plus">4+</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="mb-2 block text-sm font-medium">Area (m²)</label>
            <select
              value={areaFilter}
              onChange={(e) => {
                setAreaFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Any</option>
              <option value="under-100">Under 100</option>
              <option value="100-200">100-200</option>
              <option value="200-300">200-300</option>
              <option value="300-plus">300+</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredPlans.length)} of{" "}
          {filteredPlans.length} plans
        </div>
        <div>
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Plan</th>
                <th className="hidden sm:table-cell p-3 text-left text-sm font-medium">
                  Style
                </th>
                <th className="hidden lg:table-cell p-3 text-left text-sm font-medium">
                  Specs
                </th>
                <th className="hidden md:table-cell p-3 text-left text-sm font-medium">
                  Price
                </th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
                <th className="p-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No plans found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    onClick={() => router.push(`/hp-admin/plans/${plan.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {plan.images?.[0] ? (
                            <Image
                              src={plan.images[0].cloudinaryUrl}
                              alt={plan.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-xs text-muted-foreground">
                            #{plan.planNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-3 text-sm capitalize">
                      {plan.style.replace(/-/g, " ")}
                    </td>
                    <td className="hidden lg:table-cell p-3 text-sm">
                      {plan.bedrooms} bed · {plan.baths} bath · {plan.floors}{" "}
                      floor · {plan.sqft}m²
                    </td>
                    <td className="hidden md:table-cell p-3 text-sm font-medium">
                      KSh {Number(plan.basePrice).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
                            plan.published
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {plan.published ? "Published" : "Unpublished"}
                        </span>
                        {plan.featured && (
                          <span className="inline-flex w-fit rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublish(plan.id, plan.published)}
                          disabled={loadingPlanId === plan.id}
                          title={plan.published ? "Unpublish" : "Publish"}
                        >
                          {loadingPlanId === plan.id ? (
                            <span className="size-4">...</span>
                          ) : plan.published ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/hp-admin/plans/${plan.id}/edit`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlan(plan.id)}
                          disabled={loadingPlanId === plan.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {loadingPlanId === plan.id ? (
                            <span className="size-4">...</span>
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="size-9 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
