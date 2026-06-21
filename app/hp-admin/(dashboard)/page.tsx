import { Home, Package, MessageSquare, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getDashboardStats, getRecentOrders, getRecentMessages } from "@/app/actions/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - KEPlans Admin",
  description: "KEPlans admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 0; // Don't cache

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders(5);
  const recentMessages = await getRecentMessages(5);

  const statCards = [
    { label: "Total Plans", value: stats.totalPlans, icon: Home, link: "/hp-admin/plans" },
    { label: "Active Orders", value: stats.activeOrders, icon: Package, link: "/hp-admin/orders" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, link: "/hp-admin/messages" },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users, link: "/hp-admin/customers" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to KEPlans Admin</p>
        </div>
        <Button asChild>
          <Link href="/hp-admin/plans/new">
            <Plus className="size-4 mr-2" />
            Create Plan
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.link}
              className="rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="size-5 text-foreground" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders & Messages */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Recent Orders</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-muted-foreground">{order.plan}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">KSh {order.amount.toLocaleString()}</div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : order.status === "pending"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Recent Messages</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  {msg.unread && (
                    <div className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                  {!msg.unread && <div className="mt-1.5 size-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${msg.unread ? "font-semibold" : ""}`}>
                      {msg.sender}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {msg.subject}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">{msg.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
