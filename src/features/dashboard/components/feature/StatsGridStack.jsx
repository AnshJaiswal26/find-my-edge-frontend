import React, { useRef } from "react";
import { useDashboardStore } from "@features/dashboard/store";
import { useGridStack } from "@features/dashboard/hooks";
import StatGridItem from "./StatGridItem";

export default function StatsGridStack() {
  const gridRef = useRef(null);

  const statsOrder = useDashboardStore((s) => s.statsOrder);

  useGridStack(gridRef, {
    order: [...statsOrder],
    idPrefix: "stat-",
    onLayoutChange: (layout) => {
      useDashboardStore.getState().setLayout(layout);
    },
    resizable: { handles: "none" },
    columns: { min: 5, sm: 10, md: 16, lg: 28 },
  });

  return (
    <div className="grid-stack" ref={gridRef}>
      {statsOrder.map((id, index) => (
        <StatGridItem key={index} id={id} />
      ))}
    </div>
  );
}
