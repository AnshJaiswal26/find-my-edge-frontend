import { useDashboardStore } from "@features/dashboard/store";
import { useMemo, useRef } from "react";
import ChartGridItem from "./ChartGridItem";
import { useGridStack } from "@shared/hooks";
import { useChartEngineEvent } from "@modules/charts/apex/hooks";
import { useTradeStore } from "@shared/stores";

export default function ChartGridStack() {
  const gridRef = useRef(null);

  const chartsOrder = useDashboardStore((s) => s.chartsOrder);

  const tradesOrder = useTradeStore((s) => s.tradesOrder);
  const tradesById = useTradeStore((s) => s.tradesById);
  const derivedByTradeId = useTradeStore((s) => s.derivedByTradeId);

  const schemasById = useTradeStore((s) => s.schemasById);

  const dataset = useMemo(() => {
    return {
      ids: tradesOrder,

      seriesSelector: (id, s) => {
        const derived = derivedByTradeId[id];
        const raw = tradesById[id];
        const field = s?.field ?? s;

        return derived?.[field] ?? raw?.[field] ?? null;
      },

      groupSelector: null,
    };
  }, [tradesOrder, tradesById, derivedByTradeId]);

  useGridStack(gridRef, {
    onLayoutChange: (layout) => {
      useDashboardStore.getState().setLayout(layout);
    },
  });

  // const removeChart = useCallback(
  //   (chartId) => {
  //     const scrollContainer = document.getElementById("app-container");
  //     const scrollTop = scrollContainer.scrollTop;

  //     deleteChart(chartId);

  //     requestAnimationFrame(() => {
  //       scrollContainer.scrollTop = scrollTop;
  //     });
  //   },
  //   [deleteChart],
  // );

  useChartEngineEvent("chart:remove", useDashboardStore.getState().deleteChart);

  return (
    <div className="grid-stack" ref={gridRef}>
      {chartsOrder.map((id) => (
        <ChartGridItem
          key={`chart-${id}`}
          id={id}
          dataset={dataset}
          getDisplayValue={(metric) => schemasById[metric]?.display}
          getSemanticType={(metric) => schemasById[metric]?.semanticType}
        />
      ))}
    </div>
  );
}
