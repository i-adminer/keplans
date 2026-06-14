import ContactSection from "@/components/home/contact-section";

export const metadata = {
  title: "Contact Us | KEPlans",
  description:
    "Contact KEPlans for plan guidance, support, and project questions.",
};

export default function ContactUsPage() {
  return (
    <main className="bg-background text-foreground pt-20">
      <ContactSection />
    </main>
  );
}
