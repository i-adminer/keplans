import Recent from "@/components/home/recent";
import Trending from "@/components/home/trending";
import Cta from "@/components/home/cta";
import Hero from "@/components/home/hero";
import Rated from "@/components/home/top-rated";
import Family from "@/components/home/family";
import ContactSection from "@/components/home/contact-section";
import ReviewsSection from "@/components/home/reviews";

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
