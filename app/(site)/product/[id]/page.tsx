import type { Metadata } from "next";
import ProductDetailPage from "@/components/product-detail/product-detail-page";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // In production, fetch real product data
  const productId = params.id;
  
  // Mock data - replace with real API call
  const product = {
    name: "Modern House Plan 1064-280",
    description: "This modern design floor plan is 1679 sq ft and has 2 bedrooms and 2 bathrooms. Features an open concept layout with vaulted ceilings.",
    price: 1250,
    sqft: 1679,
    beds: 2,
    baths: 2,
    style: "Modern",
    image: "/herobg/hbg-1.jpg",
  };

  return {
    title: `${product.name} - ${product.sqft} Sq Ft ${product.style} Home Design`,
    description: `${product.description} Starting at $${product.price}. View floor plans, elevations, and specifications.`,
    keywords: [
      `${product.style.toLowerCase()} house plans`,
      `${product.beds} bedroom house plans`,
      `${product.sqft} sq ft house plans`,
      "house floor plans",
      "architectural designs",
      "home blueprints",
    ],
    openGraph: {
      title: `${product.name} - KEPlans`,
      description: product.description,
      type: "website",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - KEPlans`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="bg-background text-foreground pt-20">
      <ProductDetailPage id={params.id} />
    </main>
  );
}
