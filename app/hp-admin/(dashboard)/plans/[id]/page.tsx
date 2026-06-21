import { getPlan } from "@/app/actions/plans";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPlan(id);

  if (!result.success || !result.plan) {
    notFound();
  }

  const plan = result.plan;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/hp-admin/plans">
            <ArrowLeft className="size-4 mr-2" />
            Back to Plans
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/hp-admin/plans/${id}/edit`}>
            <Edit className="size-4 mr-2" />
            Edit Plan
          </Link>
        </Button>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Plan Name
            </label>
            <p className="text-2xl font-bold mt-1">{plan.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Plan Number
            </label>
            <p className="text-xl font-semibold mt-1">#{plan.planNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Style
            </label>
            <p className="text-lg mt-1">{plan.style}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Base Price
            </label>
            <p className="text-2xl font-bold text-green-500 mt-1">
              KSh {Number(plan.basePrice).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
          <div>
            <label className="text-xs text-muted-foreground">Bedrooms</label>
            <p className="text-2xl font-bold">{plan.bedrooms}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Bathrooms</label>
            <p className="text-2xl font-bold">{plan.baths}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Floors</label>
            <p className="text-2xl font-bold">{plan.floors}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Square Feet</label>
            <p className="text-2xl font-bold">{plan.sqft}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-2 mt-6">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              plan.published
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {plan.published ? "Published" : "Unpublished"}
          </span>
          {plan.featured && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {plan.description && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plan.description}
          </p>
        </div>
      )}

      {/* Images */}
      {plan.images && plan.images.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Images ({plan.images.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.images.map((img: any) => (
              <div
                key={img.id}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted group"
              >
                <Image
                  src={img.cloudinaryUrl}
                  alt={img.caption || plan.name}
                  fill
                  className="object-cover"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.caption}
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {img.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Specs & Features */}
      {plan.fullSpecsAndFeatures && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Full Specs & Features</h3>
          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: plan.fullSpecsAndFeatures }}
          />
        </div>
      )}

      {/* What's Included */}
      {plan.includedItemsHTML && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">What's Included</h3>
          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: plan.includedItemsHTML }}
          />
        </div>
      )}

      {/* Documents */}
      {plan.documents && plan.documents.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Documents ({plan.documents.length})
          </h3>
          <div className="space-y-2">
            {plan.documents.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{doc.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.documentType.toUpperCase()} •{" "}
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {plan.options && plan.options.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Options ({plan.options.length})
          </h3>
          <div className="space-y-3">
            {plan.options.map((opt: any) => (
              <div
                key={opt.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-muted text-xs rounded">
                      {opt.optionType}
                    </span>
                    <p className="font-medium">{opt.label}</p>
                  </div>
                  {opt.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {opt.description}
                    </p>
                  )}
                </div>
                <p className="font-bold text-lg">
                  +KSh {Number(opt.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {plan.faqs && plan.faqs.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            FAQs ({plan.faqs.length})
          </h3>
          <div className="space-y-4">
            {plan.faqs.map((faq: any) => (
              <div key={faq.id} className="p-4 border rounded-lg">
                <p className="font-semibold text-base">{faq.question}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
