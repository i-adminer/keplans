import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | KEPlans",
  description: "KEPlans Terms and Conditions",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing and using KEPlans' website and services, you accept
              and agree to be bound by these Terms and Conditions. If you do not
              agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              License and Use of Plans
            </h2>
            <h3 className="text-xl font-semibold mb-3">Single-Use License</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you purchase house plans from KEPlans, you receive a
              single-use license to construct one dwelling. This license is
              non-transferable and non-exclusive.
            </p>
            <h3 className="text-xl font-semibold mb-3">Permitted Use</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Build one residential structure from the purchased plans</li>
              <li>Make necessary modifications for building code compliance</li>
              <li>
                Share plans with contractors and builders for construction
                purposes
              </li>
            </ul>
            <h3 className="text-xl font-semibold mb-3">Prohibited Use</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Reproducing or distributing plans without authorization</li>
              <li>Building multiple structures from a single-use license</li>
              <li>Reselling or transferring plans to others</li>
              <li>
                Using plans for commercial development without proper licensing
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Copyright and Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All house plans, designs, drawings, and related materials are
              protected by copyright and remain the intellectual property of
              their respective designers and KEPlans. Unauthorized use,
              reproduction, or distribution is strictly prohibited and may
              result in legal action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Plan Modifications</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While you may modify purchased plans to meet local building codes
              and your specific needs, KEPlans and the original designers are
              not responsible for modifications made by you or third parties. We
              recommend working with a licensed architect or engineer for
              significant modifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All prices are listed in Kenyan Shillings (KES) and are subject to
              change without notice. Payment must be received in full before
              plan delivery. We accept payments through M-Pesa, credit cards,
              and bank transfers via our secure payment processors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Delivery of Plans</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Digital plans (PDF, CAD) are delivered via email within 24-48
              hours of payment confirmation. Physical plans, if ordered, are
              shipped within 5-7 business days. Delivery times may vary based on
              location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Due to the digital nature of our products, all sales are final.
              Refunds may be considered only in cases where:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Plans were not delivered within the specified timeframe</li>
              <li>
                Plans received are significantly different from what was ordered
              </li>
              <li>Technical errors prevented access to downloaded files</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Refund requests must be submitted within 7 days of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Building Codes and Permits
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              It is the buyer's responsibility to ensure that purchased plans
              comply with local building codes, zoning regulations, and permit
              requirements. Plans may need to be modified or stamped by a local
              licensed professional before construction. KEPlans is not
              responsible for code compliance or permit approvals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              House plans are provided "as is" without warranties of any kind.
              While we strive for accuracy, KEPlans and its designers do not
              warrant that plans are error-free or suitable for all locations
              and conditions. Construction should only proceed after review and
              approval by qualified professionals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              KEPlans shall not be liable for any indirect, incidental, special,
              or consequential damages arising from the use of our plans or
              services. Our total liability shall not exceed the amount paid for
              the specific house plan in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms and Conditions are governed by the laws of Kenya. Any
              disputes arising from these terms shall be subject to the
              exclusive jurisdiction of Kenyan courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For questions about these Terms and Conditions, please contact us:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground mb-4">
              <li>Email: support@keplans.com</li>
              <li>Phone: 254-712-456-987</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
