import { useDashboardStore } from "@features/dashboard/store";
import { useRef } from "react";
import ChartGridItem from "./ChartGridItem";
import { useGridStack } from "@shared/hooks";

export default function ChartGridStack({
  seriesOrder,
  seriesById,
  schemasById,
  schemasOrder,
}) {
  const gridRef = useRef(null);

  const chartsOrder = useDashboardStore((s) => s.chartsOrder);
  const deleteChart = useDashboardStore((s) => s.deleteChart);

  useGridStack(gridRef, {
    onLayoutChange: (layout) => {
      useDashboardStore.getState().setLayout(layout);
    },
  });

  return (
    <div className="grid-stack" ref={gridRef}>
      {chartsOrder.map((id) => (
        <ChartGridItem
          key={`chart-${id}`}
          id={id}
          seriesOrder={seriesOrder}
          seriesById={seriesById}
          schemasOrder={schemasOrder}
          schemasById={schemasById}
          ids={seriesOrder}
          seriesSelector={(id, metric) => seriesById[id]?.[metric] || 0}
          onRemove={(chartId) => {
            const scrollContainer = document.getElementById("app-container");
            const scrollTop = scrollContainer.scrollTop;

            deleteChart(chartId);

            requestAnimationFrame(() => {
              scrollContainer.scrollTop = scrollTop;
            });
          }}
        />
      ))}
    </div>
  );
}
