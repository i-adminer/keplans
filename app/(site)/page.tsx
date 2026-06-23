import Recent from "@/components/home/recent";
import Trending from "@/components/home/trending";
import Cta from "@/components/home/cta";
import Hero from "@/components/home/hero";
import Rated from "@/components/home/top-rated";
import Family from "@/components/home/family";
import ContactSection from "@/components/home/contact-section";
import ReviewsSection from "@/components/home/reviews";
import { getPublishedPlans, getFeaturedPlans } from "@/app/actions/plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Explore Premium House Plans",
  description:
    "Discover premium house plans and architectural designs. Browse modern, contemporary, farmhouse, and traditional home designs. Start building your dream home today.",
  openGraph: {
    title: "KEPlans - Premium House Plans & Architectural Designs",
    description:
      "Discover premium house plans and architectural designs. Browse modern, contemporary, farmhouse, and traditional home designs.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function Home() {
  const [allPlansResult, featuredResult] = await Promise.all([
    getPublishedPlans(),
    getFeaturedPlans(),
  ]);

  const allPlans = allPlansResult.success ? allPlansResult.plans : [];

  console.log("ALL PLANS:", allPlans);

  // Sort for different sections
  const recentPlans = [...allPlans].slice(0, 12);
  const trendingPlans = [...allPlans].filter((p) => p.trending).slice(0, 12);
  const topRatedPlans = [...allPlans].filter((p) => p.topRated).slice(0, 12);
  const familyPlans = [...allPlans].filter((p) => p.familyPick).slice(0, 12);

  return (
    <div>
      <Hero />
      <Recent plans={recentPlans} />
      <Trending plans={trendingPlans} />
      <Rated plans={topRatedPlans} />
      <Cta />
      <Family plans={familyPlans} />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
