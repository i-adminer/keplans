import { LayoutDashboard } from "lucide-react";
import React from "react";

export default function Logo() {
  return (
    <div className="flex gap-1">
      <LayoutDashboard />
      <span className="font-black text-xl bg-linear-to-r from-green-400 to-cyan-300 w-max text-transparent bg-clip-text">
        KEPlans
      </span>
    </div>
  );
}
