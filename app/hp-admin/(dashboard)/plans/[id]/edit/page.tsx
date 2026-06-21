import { getPlan } from "@/app/actions/plans";
import PlanCreationForm from "@/components/admin/plan-creation-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Plan | KEPlans Admin",
};

export default async function EditPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await getPlan(id);

  if (!result.success || !result.plan) {
    notFound();
  }

  let plan = result.plan;
  function nullToUndefined<T>(obj: T): T {
    return JSON.parse(
      JSON.stringify(obj, (_, value) => (value === null ? undefined : value)),
    );
  }
  plan = nullToUndefined(plan);

  const formInitialData = {
    name: String(plan.name ?? ""),
    planNumber: String(plan.planNumber ?? ""),
    summary: String(plan.summary ?? ""),
    description: String(plan.description ?? ""),
    style: String(plan.style ?? ""),
    bedrooms: String(plan.bedrooms ?? ""),
    baths: String(plan.baths ?? ""),
    floors: String(plan.floors ?? ""),
    garages: String(plan.garages ?? ""),
    sqft: String(plan.sqft ?? ""),
    width: String(plan.width ?? ""),
    depth: String(plan.depth ?? ""),
    mainFloorArea: String(plan.mainFloorArea ?? ""),
    basementArea: String(plan.basementArea ?? ""),
    porchArea: String(plan.porchArea ?? ""),
    basePrice: String(plan.basePrice ?? ""),
    pdfPrice: String(plan.pdfPrice ?? ""),
    cadPrice: String(plan.cadPrice ?? ""),
    badge: plan.badge ?? "",
    unlimitedBuildPrice: String(plan.unlimitedBuildPrice ?? ""),
    height: String(plan.height ?? ""),
    fullSpecsAndFeatures: plan.fullSpecsAndFeatures ?? "",
    includedItemsHTML: plan.includedItemsHTML ?? "",
    featured: plan.featured ?? false,
    trending: plan.trending ?? false,
    topRated: plan.topRated ?? false,
    familyPick: plan.familyPick ?? false,

    images: (plan.images ?? []).map((img: any) => ({
      id: img.id,
      file: null,
      previewUrl: img.cloudinaryUrl,
      category: img.category,
      caption: img.caption ?? "",
    })),

    planDocuments: (plan.documents ?? []).map((doc: any) => ({
      id: doc.id,
      file: null,
      previewUrl: doc.cloudinaryUrl,
      type: doc.type ?? "pdf",
      description: doc.description ?? "",
    })),

    foundationOptions: (plan.options ?? [])
      .filter((o: any) => o.type === "foundation")
      .map((o: any) => ({
        label: o.label ?? "",
        price: String(o.price ?? ""),
        description: o.description ?? "",
      })),

    addOns: (plan.options ?? [])
      .filter((o: any) => o.type === "addon")
      .map((o: any) => ({
        label: o.label ?? "",
        price: String(o.price ?? ""),
        description: o.description ?? "",
      })),

    // FAQs
    faqs: plan.faqs ?? [],
  };

  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit House Plan</h1>
        <p className="text-muted-foreground">
          Update plan details and settings
        </p>
      </div>

      <PlanCreationForm mode="edit" planId={id} initialData={formInitialData} />
    </div>
  );
}
