"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Package,
} from "lucide-react";

const data = {
  user: {
    name: "Admin User",
    email: "admin@keplans.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/hp-admin",
      icon: <LayoutDashboard />,
      isActive: true,
    },
    {
      title: "House Plans",
      url: "/hp-admin/plans",
      icon: <Home />,
      items: [
        {
          title: "All Plans",
          url: "/hp-admin/plans",
        },
        {
          title: "Add New",
          url: "/hp-admin/plans/new",
        },
      ],
    },
    {
      title: "Orders",
      url: "/hp-admin/orders",
      icon: <Package />,
    },
    {
      title: "Messages",
      url: "/hp-admin/messages",
      icon: <MessageSquare />,
    },
    {
      title: "Customers",
      url: "/hp-admin/customers",
      icon: <Users />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Logo />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
