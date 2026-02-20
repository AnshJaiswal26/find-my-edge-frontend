import React from "react";
import { StatCard } from "@ui";
import { useDashboardStore } from "../store/useDashboardStore";

function StatCards() {
  const statsOrder = useDashboardStore((s) => s.statsOrder);
  return (
    <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {statsOrder.map((id, index) => (
        <StatCard key={index} statId={id} />
      ))}
    </div>
  );
}

export default StatCards;
