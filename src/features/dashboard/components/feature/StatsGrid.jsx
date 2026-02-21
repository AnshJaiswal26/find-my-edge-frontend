import React from "react";
import { useDashboardStore } from "@features/dashboard/store";
import StatCard from "../ui/StatCard";

export default function StatsGrid() {
  const statsOrder = useDashboardStore((s) => s.statsOrder);
  return (
    <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {statsOrder.map((id, index) => (
        <StatCard key={index} statId={id} />
      ))}
    </div>
  );
}
