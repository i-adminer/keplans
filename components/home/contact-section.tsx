import { ChevronDown, MapPin, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Are the plans suitable for county approvals in Kenya?",
    answer:
      "Our plans are designed to be a strong starting point for county review. If you need edits for a specific site or approval requirement, tell us in the form and we will guide you on the next step.",
  },
  {
    question: "Can I request changes to a plan?",
    answer:
      "Yes. Share the bedrooms, stories, and the type of change you want. We will review what can be adjusted for your project.",
  },
  {
    question: "How much should I budget for construction?",
    answer:
      "Budget depends on location, finishes, structure type, and site conditions. Send us the basics and we can point you toward the right plan range.",
  },
  {
    question: "Do you help with urban and rural plots?",
    answer:
      "Yes. Whether you are building in Nairobi, the counties, or on a rural plot, we can help match the plan to your land and needs.",
  },
  {
    question: "Can I speak to someone before choosing a design?",
    answer:
      "Absolutely. Use the form below and mention that you want a quick call back. We will get back to you as soon as possible.",
  },
];

function FaqRow({ question, answer }: FaqItem) {
  return (
    <details className="group border-b border-border py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground outline-none [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-transform group-open:rotate-180">
          <ChevronDown className="size-4" />
        </span>
      </summary>
      <p className="mt-3 max-w-3xl pr-10 text-sm leading-6 text-muted-foreground">
        {answer}
      </p>
    </details>
  );
}

export default function ContactSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream dark:bg-cream/10 ">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[42%] opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168, 195, 111, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 195, 111, 0.5) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
            maskImage:
              "radial-gradient(circle at 55% 50%, black 0%, black 36%, transparent 76%)",
            WebkitMaskImage:
              "radial-gradient(circle at 55% 50%, black 0%, black 36%, transparent 76%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl font-playfair">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base font-playfair">
              Have a question about a KEPlans design, a Kenyan build, or a
              change you want made? Fill out the form and we will be in touch.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span className=" font-playfair">
                Working with clients across Kenya and beyond
              </span>
            </div>
          </div>

          <form className="mx-auto mt-12 max-w-4xl p-6 hover:shadow-2xl sm:p-8 lg:p-10">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">First Name</span>
                <Input placeholder="First Name" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Last Name</span>
                <Input placeholder="Last Name" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Email</span>
                <Input type="email" placeholder="Email" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Phone Number</span>
                <Input type="tel" placeholder="+254 700 000 000" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">
                  When do you want to start?
                </span>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring">
                  <option>Choose a timeline</option>
                  <option>Immediately</option>
                  <option>Within 3 months</option>
                  <option>Within 6 months</option>
                  <option>Later this year</option>
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">
                  How can we help you?
                </span>
                <textarea
                  rows={6}
                  placeholder="Tell us about your project, the number of bedrooms, the number of stories, and any county or site details."
                  className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </label>
            </div>

            <label className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-input cursor-pointer"
              />
              <span>Send me project updates and new plan releases too.</span>
            </label>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="inline-flex cursor-pointer h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Expert Advice
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="faq" className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-stretch">
            <div className="hover:shadow-2xl p-6 sm:p-8 lg:p-10">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl font-playfair">
                  FQ & As
                </h2>
              </div>

              <div className="mt-6">
                {faqs.map((faq) => (
                  <FaqRow key={faq.question} {...faq} />
                ))}
              </div>
            </div>

            <div
              className="relative overflow-hidden sm:p-8 bg-no-repeat bg-contain bg-center min-h-100 lg:min-h-full"
              style={{
                backgroundImage: "url('/imgs/faq.png')",
                backgroundAttachment: "local",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
