"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Printer,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";

interface ProductDetailProps {
  id: string;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Full Specs & Features" },
  { id: "included", label: "What's Included" },
  { id: "faqs", label: "FAQs" },
  { id: "more", label: "More Plans" },
];

export default function ProductDetailPage({ id }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFilter, setImageFilter] = useState("all");
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();

  const product = {
    id: id || "modern-1",
    name: "Modern House Plan 1064-280",
    style: "Modern",
    sqft: 1679,
    beds: 2,
    baths: 2,
    floors: 1,
    garages: 0,
    price: 1250,
    badge: "Best Price Guaranteed",
    description:
      "This modern design floor plan is 1679 sq ft and has 2 bedrooms and 2 bathrooms. Features an open concept layout with vaulted ceilings, abundant natural light through large windows, and seamless indoor-outdoor living spaces. Perfect for modern lifestyles with efficient use of space and contemporary aesthetic.",
    images: [
      {
        id: 1,
        url: "/herobg/hbg-1.jpg",
        category: "exterior",
        caption: "Front Elevation - Modern Design",
      },
      {
        id: 2,
        url: "/herobg/hbg-2.jpg",
        category: "exterior",
        caption: "Rear Elevation with Deck",
      },
      {
        id: 4,
        url: "/herobg/hbg-1.jpg",
        category: "interior",
        caption: "Open Concept Living Room",
      },
    ],
  };

  const filteredImages =
    imageFilter === "all"
      ? product.images
      : product.images.filter((img) => img.category === imageFilter);

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
    if (!isInCart(product.id)) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
      });
    }
  };

  const handleWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
    });
  };

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/plans" className="hover:text-foreground">
          Style
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.style}</span>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {product.sqft} Sq Ft, {product.beds} Bed, {product.baths} Bath,{" "}
              {product.floors} Floor, {product.garages} Garage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" className="gap-2">
              <Printer className="size-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Share2 className="size-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`gap-2 ${inWishlist ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}`}
              onClick={handleWishlist}
            >
              <Heart
                className={`size-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="hidden sm:inline">
                {inWishlist ? "Saved" : "Save"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {product.images.slice(0, 4).map((image, idx) => (
            <button
              key={image.id}
              onClick={() => {
                setCurrentImageIndex(idx);
                setGalleryOpen(true);
              }}
              className={`group relative overflow-hidden rounded-lg ${
                idx === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${idx === 0 ? "aspect-[16/10]" : "aspect-square"}`}
              >
                <Image
                  src={image.url}
                  alt={image.caption}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {idx === 0 && (
                  <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg">
                    3D Tour →
                  </div>
                )}
                {idx === 2 && (
                  <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg">
                    Floor Plans
                  </div>
                )}
                {idx === 3 && (
                  <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg">
                    View All Images
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border bg-background">
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
                      <div className="text-4xl font-bold">{product.beds}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Beds
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{product.baths}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Baths
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{product.floors}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Floors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {product.garages}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Garages
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {product.sqft.toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Square Feet
                      </div>
                    </div>
                  </div>
                </section>

                {/* Description */}
                <section>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </section>

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
                    Let us know a bit about your plans and we&apos;ll be happy to
                    help.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button size="lg" className="gap-2">
                      Get Expert Advice
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Or call</span>
                      <a
                        href="tel:1-800-913-2350"
                        className="font-semibold text-foreground underline"
                      >
                        1-800-913-2350
                      </a>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "specs" && (
              <section className="rounded-lg border border-border bg-background p-6">
                <h2 className="mb-6 font-playfair text-2xl font-semibold">
                  Full Specs & Features
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">Foundation</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Crawl space foundation included</li>
                      <li>• Basement and slab options available</li>
                      <li>• Engineered foundation design</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Exterior Features</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Modern mixed material facade</li>
                      <li>• Low-slope roof design</li>
                      <li>• Covered outdoor living space</li>
                      <li>• Energy efficient windows</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Interior Layout</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Open concept living/dining/kitchen</li>
                      <li>• Vaulted ceilings in main living area</li>
                      <li>• Master suite with private bath</li>
                      <li>• Flexible second bedroom/office space</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "included" && (
              <section className="rounded-lg border border-border bg-background p-6">
                <h2 className="mb-6 font-playfair text-2xl font-semibold">
                  What&apos;s Included
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="size-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">
                        Complete Construction Drawings
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Detailed floor plans, elevations, and sections
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="size-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Foundation Plans</h3>
                      <p className="text-sm text-muted-foreground">
                        Structural foundation layout and details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="size-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Electrical Plans</h3>
                      <p className="text-sm text-muted-foreground">
                        Lighting and outlet locations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="size-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Material List</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive building materials schedule
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "faqs" && (
              <section className="rounded-lg border border-border bg-background p-6">
                <h2 className="mb-6 font-playfair text-2xl font-semibold">
                  FAQs
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold">Can I modify this plan?</h3>
                    <p className="mt-2 text-muted-foreground">
                      Yes, we offer modification services to customize any plan
                      to your specific needs.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      How long until I receive my plans?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Digital plans are delivered instantly. Physical plans ship
                      within 1-2 business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Are building permits included?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Plans are designed to meet international building codes
                      but may need local modifications for permits.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-lg border border-border bg-background p-6 shadow-lg">
              <h3 className="font-playfair text-2xl font-semibold">
                {product.style} Plan
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Starts at{" "}
                <span className="font-semibold text-foreground">
                  ${product.price.toLocaleString()}
                </span>
              </p>
              <div className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                {product.badge}
              </div>

              <div className="mt-6 space-y-4">
                {/* Plan Type */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      1
                    </div>
                    <label className="text-sm font-medium">
                      Plan Type Options
                    </label>
                  </div>
                  <select className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option>PDF Set - ${product.price.toLocaleString()}</option>
                    <option>
                      CAD Files - ${(product.price + 500).toLocaleString()}
                    </option>
                    <option>
                      Reproducible Set - $
                      {(product.price + 300).toLocaleString()}
                    </option>
                  </select>
                </div>

                {/* Foundation */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      2
                    </div>
                    <label className="text-sm font-medium">
                      Foundation Options
                    </label>
                  </div>
                  <select className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                    <option>Make Selection</option>
                    <option>Crawl Space (Included)</option>
                    <option>Slab (+$200)</option>
                    <option>Basement (+$400)</option>
                  </select>
                </div>

                {/* Framing */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      3
                    </div>
                    <label className="text-sm font-medium">
                      Framing Options
                    </label>
                  </div>
                  <select className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                    <option>Make Selection</option>
                    <option>Wood Frame (Standard)</option>
                    <option>Steel Frame (+$150)</option>
                  </select>
                </div>

                {/* Add-ons */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      4
                    </div>
                    <label className="text-sm font-medium">
                      Optional Add-Ons
                    </label>
                  </div>
                  <select className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                    <option>Optional Add-Ons</option>
                    <option>Material List (+$100)</option>
                    <option>Mirror Reverse (+$50)</option>
                    <option>Extra Sets (+$75 each)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  disabled={inCart}
                >
                  {inCart ? (
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
                <Button size="lg" variant="outline" className="w-full">
                  Buy This Plan Now
                </Button>
              </div>

              {/* Financing */}
              <div className="mt-6 rounded-lg bg-accent p-4 text-center">
                <p className="text-sm">
                  <span className="font-semibold">0% APR</span> or as low as{" "}
                  <span className="font-semibold">$78/mo</span>
                </p>
                <button className="mt-1 text-xs text-muted-foreground underline">
                  See if you qualify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Lightbox */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGalleryOpen(false)}
                  className="text-white hover:text-white/80"
                >
                  <X className="size-6" />
                </button>
                <div className="flex gap-2">
                  {["all", "exterior", "interior", "floor"].map((filter) => (
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
                  ))}
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative flex-1">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative h-full w-full max-w-6xl">
                  <Image
                    src={
                      filteredImages[currentImageIndex]?.url ||
                      "/herobg/hbg-1.jpg"
                    }
                    alt={filteredImages[currentImageIndex]?.caption || ""}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Navigation Arrows */}
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

              {/* Caption */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm">
                {filteredImages[currentImageIndex]?.caption}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="border-t border-white/10 bg-black/50 p-4">
              <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
                {filteredImages.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      currentImageIndex === idx
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.caption}
                      fill
                      className="object-cover"
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
