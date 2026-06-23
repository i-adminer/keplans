import AllOrdersTable from "@/components/admin/all-orders-table";
import { getAllOrders } from "@/app/actions/orders";

export const metadata = {
  title: "Orders | KEPlans Admin",
  description: "Manage customer orders",
};

export const revalidate = 0;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const { customer } = await searchParams;
  const result = await getAllOrders();
  const orders = result.success ? result.orders : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and deliveries
        </p>
      </div>

      <AllOrdersTable orders={orders} customerEmail={customer} />
    </div>
  );
}
