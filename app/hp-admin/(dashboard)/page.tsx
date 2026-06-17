import { Home, Package, MessageSquare, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - KEPlans Admin",
  description: "KEPlans admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  // Dummy stats with links
  const stats = [
    { label: "Total Plans", value: "127", icon: Home, change: "+12%", link: "/hp-admin/plans" },
    { label: "Active Orders", value: "45", icon: Package, change: "+8%", link: "/hp-admin/orders" },
    { label: "Unread Messages", value: "23", icon: MessageSquare, change: "+5%", link: "/hp-admin/messages" },
    { label: "Total Customers", value: "1,429", icon: Users, change: "+18%", link: "/hp-admin/customers" },
  ];

  // Dummy orders
  const recentOrders = [
    { id: "ORD-2045", customer: "John Kamau", plan: "Kenya Court Modern", amount: 128000, status: "completed" },
    { id: "ORD-2044", customer: "Mary Wanjiku", plan: "Ridge View Contemporary", amount: 184000, status: "pending" },
    { id: "ORD-2043", customer: "Peter Ochieng", plan: "Nairobi Breeze Farmhouse", amount: 216000, status: "completed" },
    { id: "ORD-2042", customer: "Grace Akinyi", plan: "Savanna Modern Villa", amount: 310000, status: "pending" },
    { id: "ORD-2041", customer: "David Mwangi", plan: "Lake View Traditional", amount: 175000, status: "canceled" },
  ];

  // Dummy messages
  const recentMessages = [
    { id: "1", sender: "James Kipchoge", subject: "Question about plan modifications", time: "2 min ago", unread: true },
    { id: "2", sender: "Sarah Njeri", subject: "Foundation options inquiry", time: "1 hour ago", unread: true },
    { id: "3", sender: "Tom Omondi", subject: "CAD files request", time: "3 hours ago", unread: false },
    { id: "4", sender: "Lucy Wangari", subject: "Payment confirmation", time: "5 hours ago", unread: false },
    { id: "5", sender: "Mike Rotich", subject: "Custom design consultation", time: "1 day ago", unread: true },
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
        {stats.map((stat) => {
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
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
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
