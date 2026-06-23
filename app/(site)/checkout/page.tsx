import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkout-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - KEPlans",
  description: "Complete your house plan purchase",
};

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?redirect=/checkout");
  }

  return (
    <main className="pt-24 pb-12 px-4 ">
      <CheckoutClient user={session} />
    </main>
  );
}
