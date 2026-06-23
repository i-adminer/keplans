import { getAllCustomers } from "@/app/actions/customers";
import CustomersTable from "@/components/admin/customers-table";

export const metadata = {
  title: "Customers | KEPlans Admin",
  description: "Manage customer accounts",
};

export const revalidate = 0;

export default async function CustomersPage() {
  const result = await getAllCustomers();
  const customers = result.success ? result.customers : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Registered customer accounts</p>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
