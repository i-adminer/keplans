import type { Metadata } from "next";
import ProductDetailPage from "@/components/product-detail/product-detail-page";

export const metadata: Metadata = {
  title: "Product Details | KEPlans",
  description: "Product detail page for KEPlans house plans.",
};

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="bg-background text-foreground pt-20">
      <ProductDetailPage id={params.id} />
    </main>
  );
}
