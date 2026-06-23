import type { Metadata } from "next";
import ProductDetailPage from "@/components/product-detail/product-detail-page";
import { getPublicPlan } from "@/app/actions/plans";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicPlan(id);

  if (!result.success || !result.plan) {
    return {
      title: "Plan Not Found - KEPlans",
      description: "The requested house plan could not be found.",
    };
  }

  const plan = result.plan;
  const firstImage = plan.images?.[0]?.cloudinaryUrl || "/herobg/hbg-1.jpg";

  return {
    title: `${plan.name} - ${plan.sqft} Sq Ft ${plan.style} Home Design | KEPlans`,
    description: `${plan.summary || plan.description} Starting at KSh ${Number(plan.basePrice).toLocaleString()}. View floor plans and specifications.`,
    keywords: [
      `${plan.style.toLowerCase()} house plans`,
      `${plan.bedrooms} bedroom house plans`,
      `${plan.sqft} sq ft house plans`,
      "house floor plans",
      "architectural designs",
      "home blueprints",
    ],
    openGraph: {
      title: `${plan.name} - KEPlans`,
      description: plan.summary || plan.description,
      type: "website",
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: plan.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${plan.name} - KEPlans`,
      description: plan.summary || plan.description,
      images: [firstImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPublicPlan(id);

  if (!result.success || !result.plan) {
    return (
      <div className="pt-20 h-72 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="text-2xl font-black text-destructive">404</div>
          <div className="font-semibold">Product not Found</div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground pt-20">
      <ProductDetailPage plan={result.plan as any} />
    </main>
  );
}
