import React from "react";
import { useDashboardStore } from "@features/dashboard/store";
import StatGridItem from "./StatGridItem";
import { useGridStack } from "@shared/hooks";

export default function StatsGridStack() {
  const statsOrder = useDashboardStore((s) => s.statsOrder);

  const { grid, containerRef } = useGridStack({
    onLayoutChange: (layout) => {
      useDashboardStore.getState().setLayout(layout);
    },
    resizable: { handles: "none" },
    columns: { min: 5, sm: 10, md: 16, lg: 28 },
  });

  return (
    <div className="grid-stack" ref={containerRef}>
      {statsOrder.map((id, index) => (
        <StatGridItem key={index} id={id} grid={grid} />
      ))}
    </div>
  );
}
