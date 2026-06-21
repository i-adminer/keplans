import AllPlansTable from "@/components/admin/all-plans-table";
import { getAllPlans } from "@/app/actions/plans";

export const metadata = {
  title: "All Plans | KEPlans Admin",
  description: "Manage house plans",
};

export const revalidate = 0; // Don't cache

export default async function AllPlansPage() {
  const result = await getAllPlans();
  const plans = result.success ? result.plans : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All House Plans</h1>
          <p className="text-muted-foreground">
            Manage, filter, and edit your house plans
          </p>
        </div>
      </div>

      <AllPlansTable plans={plans} />
    </div>
  );
}
