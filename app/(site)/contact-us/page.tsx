import ContactSection from "@/components/home/contact-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get Expert Help with Your House Plans",
  description: "Have questions about our house plans? Contact our expert team for assistance with plan selection, modifications, and custom designs. Call 1-800-913-2350 or fill out our contact form.",
  keywords: ["contact keplans", "house plan help", "architectural consultation", "custom home design"],
  openGraph: {
    title: "Contact Us - KEPlans",
    description: "Have questions about our house plans? Contact our expert team for assistance.",
    type: "website",
  },
};

export default function ContactUsPage() {
  return (
    <main className="bg-background text-foreground pt-20">
      <ContactSection />
    </main>
  );
}
