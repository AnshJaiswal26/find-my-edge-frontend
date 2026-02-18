import React from "react";
import { StatCard } from "@ui";
import { useDashboardStore } from "../store";

function StatCards() {
  const stats = useDashboardStore((s) => s.stats);
  return (
    <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}

export default StatCards;
