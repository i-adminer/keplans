import AllPlansTable from "@/components/admin/all-plans-table";

export const metadata = {
  title: "All Plans | KEPlans Admin",
  description: "Manage house plans",
};

export default function AllPlansPage() {
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

      <AllPlansTable />
    </div>
  );
}
