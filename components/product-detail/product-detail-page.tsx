"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { toast } from "sonner";

interface PlanImage {
  id: string;
  cloudinaryUrl: string;
  category: string;
  caption: string | null;
}

interface PlanOption {
  id: string;
  optionType: string;
  label: string;
  price: string;
  description: string | null;
}

interface PlanFaq {
  id: string;
  question: string;
  answer: string;
}

interface Plan {
  id: string;
  name: string;
  planNumber: string;
  slug: string;
  style: string;
  summary: string;
  description: string;
  bedrooms: number;
  baths: string;
  floors: number;
  garages: number;
  sqft: number;
  width: string | null;
  depth: string | null;
  height?: string | null;
  mainFloorArea: number | null;
  basementArea: number | null;
  porchArea: number | null;
  basePrice: string;
  pdfPrice: string;
  cadPrice: string;
  unlimitedBuildPrice: string;
  fullSpecsAndFeatures: string;
  includedItemsHTML: string;
  badge: string;
  featured?: boolean;
  trending?: boolean;
  topRated?: boolean;
  familyPick?: boolean;
  published?: boolean;
  views?: number;
  orders?: number;
  rating?: string;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  images: PlanImage[];
  options: PlanOption[];
  faqs: PlanFaq[];
}

interface ProductDetailProps {
  plan: Plan;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Full Specs & Features" },
  { id: "included", label: "What's Included" },
  { id: "faqs", label: "FAQs" },
  { id: "more", label: "More Plans" },
];

export default function ProductDetailPage({ plan }: ProductDetailProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFilter, setImageFilter] = useState("all");
  const [selectedPlanType, setSelectedPlanType] = useState("pdf");
  const [selectedFoundation, setSelectedFoundation] = useState("");
  const [selectedAddon, setSelectedAddon] = useState("");
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);
  const foundationOptions = plan.options.filter(
    (o) => o.optionType === "foundation",
  );
  const addonOptions = plan.options.filter((o) => o.optionType === "addon");

  const filteredImages =
    imageFilter === "all"
      ? plan.images
      : plan.images.filter((img) => img.category === imageFilter);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleAddToCart = () => {
    if (!isInCart(plan.id)) {
      addToCart({
        id: plan.id,
        slug: plan.slug,
        name: plan.name,
        image: plan.images[0]?.cloudinaryUrl || "/herobg/hbg-1.jpg",
        price: Number(plan.basePrice),
      });
    }
  };

  const handleWishlist = () => {
    addToWishlist({
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
      image: plan.images[0]?.cloudinaryUrl || "/herobg/hbg-1.jpg",
      price: Number(plan.basePrice),
    });
  };

  const handleShare = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${baseUrl}/product/${plan.slug}`;

    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const inCart = isInCart(plan.id);
  const inWishlist = isInWishlist(plan.id);

  const getCurrentPrice = () => {
    let price = Number(plan.basePrice);
    if (selectedPlanType === "cad") price = Number(plan.cadPrice) || price;
    if (selectedPlanType === "unlimited")
      price = Number(plan.unlimitedBuildPrice) || price;
    const foundation = foundationOptions.find(
      (o) => o.label === selectedFoundation,
    );
    if (foundation) price += Number(foundation.price);
    const addon = addonOptions.find((o) => o.label === selectedAddon);
    if (addon) price += Number(addon.price);
    return price;
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/plans" className="hover:text-foreground">
          Plans
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{plan.name}</span>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
              {plan.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {plan.sqft.toLocaleString()} Sq Ft, {plan.bedrooms} Bed,{" "}
              {plan.baths} Bath, {plan.floors} Floor{plan.floors > 1 ? "s" : ""}
              , {plan.garages} Garage{plan.garages !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" className="gap-2" onClick={handleShare}>
              <Share2 className="size-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`gap-2 ${mounted && inWishlist ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}`}
              onClick={handleWishlist}
            >
              <Heart
                className={`size-4 ${mounted && inWishlist ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="hidden sm:inline">
                {mounted && inWishlist ? "Saved" : "Save"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plan.images.slice(0, 4).map((image, idx) => (
            <button
              key={image.id}
              onClick={() => {
                setCurrentImageIndex(idx);
                setGalleryOpen(true);
              }}
              className={`group relative overflow-hidden rounded-lg ${idx === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
            >
              <div
                className={`relative ${idx === 0 ? "aspect-16/10" : "aspect-square"}`}
              >
                <Image
                  src={image.cloudinaryUrl}
                  alt={image.caption || plan.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
                {idx === 0 && plan.images.length > 4 && (
                  <div className="absolute right-3 top-3 rounded-full bg-white/50 dark:text-primary px-3 py-1.5 text-xs font-medium shadow-lg">
                    View All →
                  </div>
                )}
              </div>
            </button>
          ))}
          {plan.images.length === 0 && (
            <div className="sm:col-span-2 sm:row-span-2 aspect-16/10 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No images available</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border bg-background sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main Content */}
          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                {/* Key Specs */}
                <section className="rounded-lg border border-border bg-background p-6">
                  <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Key Specs
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{plan.bedrooms}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Beds
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{plan.baths}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Baths
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{plan.floors}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Floors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{plan.garages}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Garages
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {plan.sqft.toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Square Feet
                      </div>
                    </div>
                  </div>
                </section>

                {/* Description */}
                {plan.description && (
                  <section>
                    <p className="text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </section>
                )}

                {/* Questions CTA */}
                <section className="rounded-lg border border-border bg-accent p-8">
                  <h3 className="font-playfair text-2xl font-semibold">
                    Questions on this plan?
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    New to the process and looking for some help to kick things
                    off?
                  </p>
                  <p className="text-muted-foreground">
                    Let us know a bit about your plans and we&apos;ll be happy
                    to help.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button size="lg" className="gap-2" asChild>
                      <Link href="/contact-us">Get Expert Advice</Link>
                    </Button>
                  </div>
                </section>
              </>
            )}

            {activeTab === "specs" && (
              <section className="rounded-lg border border-border bg-background p-6">
                <h2 className="mb-6 font-playfair text-2xl font-semibold">
                  Full Specs & Features
                </h2>
                {plan.fullSpecsAndFeatures ? (
                  <div
                    className="html-content"
                    dangerouslySetInnerHTML={{
                      __html: plan.fullSpecsAndFeatures,
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    No specifications available.
                  </p>
                )}
              </section>
            )}

            {activeTab === "included" && (
              <section className="rounded-lg border border-border bg-background p-6">
                <h2 className="mb-6 font-playfair text-2xl font-semibold">
                  What&apos;s Included
                </h2>
                {plan.includedItemsHTML ? (
                  <div
                    className="html-content"
                    dangerouslySetInnerHTML={{ __html: plan.includedItemsHTML }}
                  />
                ) : (
                  <p className="text-muted-foreground">No details available.</p>
                )}
              </section>
            )}

            {activeTab === "faqs" && (
              <section className="rounded-lg border border-border bg-background p-6">
                <h2 className="mb-6 font-playfair text-2xl font-semibold">
                  FAQs
                </h2>
                {plan.faqs.length > 0 ? (
                  <div className="space-y-6">
                    {plan.faqs.map((faq) => (
                      <div key={faq.id}>
                        <h3 className="font-semibold">{faq.question}</h3>
                        <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No FAQs available.</p>
                )}
              </section>
            )}

            {activeTab === "more" && (
              <section className="rounded-lg border border-border bg-background p-6 text-center">
                <h2 className="font-playfair text-2xl font-semibold">
                  Explore More Plans
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Browse our full collection of house plans.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/plans">Browse All Plans</Link>
                </Button>
              </section>
            )}
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-lg border border-border bg-background p-6 shadow-lg">
              <h3 className="font-playfair text-2xl font-semibold">
                {plan.style} Plan
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Starts at{" "}
                <span className="font-semibold text-foreground">
                  KES {Number(plan.basePrice).toLocaleString()}
                </span>
              </p>
              {plan.badge && (
                <div className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                  {plan.badge}
                </div>
              )}

              <div className="mt-6 space-y-4">
                {/* Plan Type */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      1
                    </div>
                    <label className="text-sm font-medium">Plan Type</label>
                  </div>
                  <select
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={selectedPlanType}
                    onChange={(e) => setSelectedPlanType(e.target.value)}
                  >
                    <option value="pdf">
                      PDF Set - KES {Number(plan.basePrice).toLocaleString()}
                    </option>
                    {plan.cadPrice && (
                      <option value="cad">
                        CAD Files - KES {Number(plan.cadPrice).toLocaleString()}
                      </option>
                    )}
                    {plan.unlimitedBuildPrice && (
                      <option value="unlimited">
                        Unlimited Build - KES{" "}
                        {Number(plan.unlimitedBuildPrice).toLocaleString()}
                      </option>
                    )}
                  </select>
                </div>

                {/* Foundation */}
                {foundationOptions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                        2
                      </div>
                      <label className="text-sm font-medium">Foundation</label>
                    </div>
                    <select
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={selectedFoundation}
                      onChange={(e) => setSelectedFoundation(e.target.value)}
                    >
                      <option value="">Make Selection</option>
                      {foundationOptions.map((opt) => (
                        <option key={opt.id} value={opt.label}>
                          {opt.label}{" "}
                          {Number(opt.price) > 0
                            ? `(+KES ${Number(opt.price).toLocaleString()})`
                            : "(Included)"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Add-ons */}
                {addonOptions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                        3
                      </div>
                      <label className="text-sm font-medium">Add-Ons</label>
                    </div>
                    <select
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={selectedAddon}
                      onChange={(e) => setSelectedAddon(e.target.value)}
                    >
                      <option value="">Optional Add-Ons</option>
                      {addonOptions.map((opt) => (
                        <option key={opt.id} value={opt.label}>
                          {opt.label} (+KES {Number(opt.price).toLocaleString()}
                          )
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-6 border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    KES {getCurrentPrice().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-3">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  disabled={mounted && inCart}
                >
                  {mounted && inCart ? (
                    <>
                      <Check className="size-5" />
                      Already in Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="size-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Lightbox */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGalleryOpen(false)}
                  className="text-white hover:text-white/80"
                >
                  <X className="size-6" />
                </button>
                <div className="flex gap-2">
                  {["all", "exterior", "interior", "floor", "3d"].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setImageFilter(filter)}
                        className={`rounded-full px-4 py-1 text-sm capitalize transition-colors ${
                          imageFilter === filter
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {filter === "all" ? "All" : filter}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative h-full w-full max-w-6xl">
                  <Image
                    src={
                      filteredImages[currentImageIndex]?.cloudinaryUrl ||
                      "/herobg/hbg-1.jpg"
                    }
                    alt={
                      filteredImages[currentImageIndex]?.caption || plan.name
                    }
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <ChevronRight className="size-6" />
              </button>
              {filteredImages[currentImageIndex]?.caption && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  {filteredImages[currentImageIndex].caption}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-black/50 p-4">
              <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
                {filteredImages.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${currentImageIndex === idx ? "border-white" : "border-transparent"}`}
                  >
                    <Image
                      src={image.cloudinaryUrl}
                      alt={image.caption || plan.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
