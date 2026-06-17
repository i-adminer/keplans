import { AppSidebar } from "@/components/app-sidebar";
import ThemeSwitcher from "@/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home, Package, MessageSquare, Users, Bell } from "lucide-react";
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
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/hp-admin">
                        KEPlans Admin
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-2">
                <button className="relative rounded-full p-2 transition-colors hover:bg-accent">
                  <Bell className="size-5 text-muted-foreground" />
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
                </button>
                <ThemeSwitcher col="text-primary" />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Plans</p>
                    <h3 className="text-2xl font-bold">156</h3>
                  </div>
                  <Home className="size-8 text-muted-foreground" />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                    <h3 className="text-2xl font-bold">1,234</h3>
                  </div>
                  <Package className="size-8 text-muted-foreground" />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Messages</p>
                    <h3 className="text-2xl font-bold">48</h3>
                  </div>
                  <MessageSquare className="size-8 text-muted-foreground" />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Customers</p>
                    <h3 className="text-2xl font-bold">892</h3>
                  </div>
                  <Users className="size-8 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold">Recent Orders</h3>
                <div className="text-sm text-muted-foreground">
                  Order management coming soon...
                </div>
              </div>
              <div className="col-span-3 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold">Recent Messages</h3>
                <div className="text-sm text-muted-foreground">
                  Message list coming soon...
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
