import Recent from "@/components/home/recent";
import Trending from "@/components/home/trending";
import Cta from "@/components/home/cta";
import Hero from "@/components/home/hero";
import Rated from "@/components/home/top-rated";
import Family from "@/components/home/family";
import ContactSection from "@/components/home/contact-section";
import ReviewsSection from "@/components/home/reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Explore Premium House Plans",
  description: "Discover premium house plans and architectural designs. Browse modern, contemporary, farmhouse, and traditional home designs. Start building your dream home today.",
  openGraph: {
    title: "KEPlans - Premium House Plans & Architectural Designs",
    description: "Discover premium house plans and architectural designs. Browse modern, contemporary, farmhouse, and traditional home designs.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Recent />
      <Trending />
      <Rated /> <Cta />
      <Family />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
