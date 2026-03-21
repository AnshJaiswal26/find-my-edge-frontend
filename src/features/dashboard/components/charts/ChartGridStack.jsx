import { useDashboardStore } from "@features/dashboard/store";
import { useMemo } from "react";
import { ChartGridItem } from "./ChartGridItem";
import { useGridStack } from "@shared/hooks";
import { useChartEngineEvent } from "@modules/charts/apex/hooks";
import { useTradeStore } from "@shared/stores";

export function ChartGridStack() {
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

  const { grid, containerRef } = useGridStack({
    onLayoutChange: (layout) => {
      useDashboardStore.getState().setLayout(layout);
    },
  });

  useChartEngineEvent("chart:remove", (id) => {
    useDashboardStore.getState().deleteChart(id);
  });

  return (
    <div className="grid-stack" ref={containerRef}>
      {chartsOrder.map((id) => (
        <ChartGridItem
          key={`chart-${id}`}
          grid={grid}
          id={id}
          dataset={dataset}
          getDisplayValue={(metric) => schemasById[metric]?.display}
          getSemanticType={(metric) => schemasById[metric]?.semanticType}
        />
      ))}
    </div>
  );
}
