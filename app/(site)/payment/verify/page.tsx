import { verifyOrder, getOrderByReference } from "@/app/actions/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Mail,
  FileText,
  Download,
  MessageCircle,
  Phone,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

export default async function VerifyPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ reference: string }>;
}) {
  const { reference } = await searchParams;

  // Failed: no reference
  if (!reference) {
    return (
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <XCircle className="size-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-playfair">
            Invalid Payment Reference
          </h1>
          <p className="text-muted-foreground mt-2">
            No payment reference was provided. Please try your purchase again.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="w-full rounded-full">
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const result = await verifyOrder(reference);

  // Success
  if (result.success) {
    const orderResult = await getOrderByReference(reference);
    const order = orderResult.success ? orderResult.order : null;

    return (
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold font-playfair">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          {order && (
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-mono font-medium">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold text-green-600">
                    KES {Number(order.total).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                    <CheckCircle className="size-3" />
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Items */}
              {order.items && order.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Purchased Plans
                  </h3>
                  <div className="space-y-2">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <FileText className="size-5 text-green-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.planName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.planType.toUpperCase()} Set
                          </p>
                        </div>
                        <span className="text-sm font-semibold shrink-0">
                          KES {Number(item.itemTotal).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email Notice */}
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="size-6 text-green-500" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Check Your Email</h2>
                <p className="text-muted-foreground mt-1">
                  We&apos;ve sent a confirmation email to your registered email
                  address with:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Download className="size-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Download links</strong> for your purchased plan
                      documents
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <FileText className="size-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Order summary</strong> with all plan details and
                      pricing
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Shield className="size-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>License information</strong> and usage terms
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <Link href="/contact-us" className="text-green-500 underline">
                    contact our support team
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MessageCircle className="size-5 text-green-500" />
              Need Help?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any issues downloading your plans or need assistance
              with your purchase, our support team is here to help.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/contact-us" className="flex items-center gap-2">
                  <MessageCircle className="size-4" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href="tel:+254700000000" className="flex items-center gap-2">
                  <Phone className="size-4" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full rounded-full">
              <Link
                href="/plans"
                className="flex items-center justify-center gap-2"
              >
                Browse More Plans
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Payment Failed
  return (
    <main className="pt-28 pb-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <XCircle className="size-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold font-playfair">Payment Failed</h1>
        <p className="text-muted-foreground mt-2">
          We were unable to process your payment. This could be due to
          insufficient funds, a network error, or your bank declining the
          transaction.
        </p>
        <div className="rounded-xl border border-border bg-card p-4 mt-4 text-left">
          <p className="text-sm font-medium">What you can do:</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>• Try a different payment method (Card or M-Pesa)</li>
            <li>• Check with your bank if the transaction was declined</li>
            <li>• Ensure you have sufficient funds</li>
            <li>• Contact our support team for assistance</li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild className="w-full rounded-full">
            <Link href="/checkout">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/contact-us">Contact Support</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
