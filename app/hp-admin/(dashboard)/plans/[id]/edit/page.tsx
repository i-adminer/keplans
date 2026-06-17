import PlanCreationForm from "@/components/admin/plan-creation-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Plan | KEPlans Admin",
};

// Mock function - replace with real DB query
function getPlanById(id: string) {
  // This would fetch from database
  return {
    id,
    name: "Kenya Court Modern",
    planNumber: "1064-280",
    summary: "A crisp starter plan",
    description: "Full description here...",
    style: "modern",
    bedrooms: "2",
    baths: "2",
    floors: "1",
    garages: "0",
    sqft: "92",
  };
}

export default function EditPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const plan = getPlanById(params.id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit House Plan</h1>
        <p className="text-muted-foreground">Update plan details and settings</p>
      </div>

      <PlanCreationForm mode="edit" planId={params.id} initialData={plan} />
    </div>
  );
}
