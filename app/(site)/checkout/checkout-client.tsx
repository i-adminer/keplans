"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  ShoppingCart,
  Check,
  Shield,
  Lock,
  CreditCard,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createOrder } from "@/app/actions/orders";

interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface CheckoutClientProps {
  user: UserSession;
}

type CheckoutStep = "cart" | "details" | "payment";

const KENYAN_PHONE_REGEX = /^(\+254|0)[17]\d{8}$/;

function formatPhoneNumber(value: string): string {
  // Strip all non-digits
  let digits = value.replace(/\D/g, "");

  // Convert 07XX to 2547XX
  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
  }
  // Add + if starts with 254
  if (digits.startsWith("254") && !value.startsWith("+")) {
    return "+" + digits.slice(0, 12);
  }

  return value;
}

export default function CheckoutClient({ user }: CheckoutClientProps) {
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("mpesa");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  function validatePhone(phoneNumber: string): boolean {
    return KENYAN_PHONE_REGEX.test(phoneNumber.replace(/\s/g, ""));
  }

  function handleContinue() {
    if (!validatePhone(phone)) {
      toast.error(
        "Please enter a valid Kenyan phone number (e.g., +254 712 345 678)",
      );
      return;
    }
    setStep("payment");
  }

  async function handlePay() {
    setLoading(true);
    try {
      const result = await createOrder({
        phone,
        items: cartItems.map((item) => ({
          planId: item.id,
          planName: item.name,
          price: item.price,
          type: "pdf",
        })),
      });

      if (result.success && result.authorizationUrl) {
        clearCart();
        window.location.href = result.authorizationUrl;
      } else {
        toast.error(result.error || "Failed to process payment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0 && step === "cart") {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <ShoppingCart className="size-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some house plans to get started.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/plans">Browse Plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-20 pt-22">
      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[
          { id: "cart", label: "Cart" },
          { id: "details", label: "Details" },
          { id: "payment", label: "Payment" },
        ].map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                step === s.id
                  ? "bg-primary text-white"
                  : step === "payment" && i < 2
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step === "payment" && i < 2 ? (
                <Check className="size-3.5" />
              ) : (
                <span className="size-5 rounded-full border border-current flex items-center justify-center text-xs">
                  {i + 1}
                </span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Cart Step */}
      {step === "cart" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-border bg-card"
              >
                <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug || item.id}`}
                    className="font-medium hover:text-green-500 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    PDF Plan Set
                  </p>
                  <p className="font-semibold text-green-600 mt-1">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted-foreground hover:text-red-500 shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-green-600">
              KES {total.toLocaleString()}
            </span>
          </div>

          <Button
            size="lg"
            className="w-full rounded-full gap-2"
            onClick={() => setStep("details")}
          >
            Continue to Checkout
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Details Step */}
      {step === "details" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("cart")}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-2xl font-bold">Your Details</h1>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            {/* Email (read-only from JWT) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="size-3.5 text-green-600" />
                Email Address
              </label>
              <Input
                value={user.email}
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Verified from your account
              </p>
            </div>

            {/* Name (read-only) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={`${user.firstName} ${user.lastName}`}
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
            </div>

            {/* Phone (editable, Kenyan format) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="size-3.5" />
                Phone Number *
              </label>
              <Input
                type="tel"
                placeholder="+254 712 345 678"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Format: +254 7XX XXX XXX or 07XX XXX XXX
              </p>
              {phone && !validatePhone(phone) && (
                <p className="text-xs text-red-500">
                  Please enter a valid Kenyan phone number
                </p>
              )}
              {phone && validatePhone(phone) && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="size-3" /> Valid phone number
                </p>
              )}
            </div>
          </div>

          {/* Order Summary Mini */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground truncate max-w-[250px]">
                  {item.name}
                </span>
                <span className="font-medium">
                  KES {item.price.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-green-600">
                KES {total.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full rounded-full gap-2"
            onClick={handleContinue}
          >
            Continue to Payment
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Payment Step */}
      {step === "payment" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("details")}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-2xl font-bold">Confirm & Pay</h1>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF Plan Set
                    </p>
                  </div>
                  <p className="font-semibold text-sm shrink-0">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-green-600">
                KES {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Payment Method</h3>
            <div className="space-y-3">
              {/* M-Pesa Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("mpesa")}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "mpesa"
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-border hover:border-green-200"
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  <Smartphone className="size-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">M-Pesa</p>
                    <p className="text-xs text-muted-foreground">
                      Pay with mobile money
                    </p>
                  </div>
                </div>
                {paymentMethod === "mpesa" && (
                  <Check className="size-5 text-green-600" />
                )}
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-border hover:border-green-200"
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  <CreditCard className="size-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">Card Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Visa, Mastercard, Verve
                    </p>
                  </div>
                </div>
                {paymentMethod === "card" && (
                  <Check className="size-5 text-green-600" />
                )}
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="size-3.5 text-green-600" />
            <span>
              You'll be redirected to Paystack's secure checkout to complete
              your payment.
            </span>
          </div>

          {/* Pay Button */}
          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`mt-0.5 size-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                agreedToTerms
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {agreedToTerms && <Check className="size-3.5 text-white" />}
            </button>
            <label className="text-xs text-muted-foreground leading-relaxed">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-green-500 underline hover:text-green-500/80"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/policies"
                target="_blank"
                className="text-green-500 underline hover:text-green-500/80"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Pay Button */}
          <Button
            size="lg"
            className="w-full rounded-full gap-2 h-14 text-lg"
            onClick={handlePay}
            disabled={loading || !agreedToTerms}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="size-5" />
                Pay KES {total.toLocaleString()} Securely
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
