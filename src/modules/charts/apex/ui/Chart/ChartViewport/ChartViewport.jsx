import { useEffect, useRef } from "react";
import { chartEngine } from "../../../model/chartEngine";
import { useChartStore } from "@modules/charts/apex/store";

export function ChartViewport({
  chartId,
  ids,
  seriesSelector,
  groupSelector,
  groups,
  groupSpec,
  selectedGroupIndex,
}) {
  const containerRef = useRef(null);

  /* ---------------- CREATE CHART ---------------- */

  useEffect(() => {
    if (!containerRef.current) return;

    chartEngine.create(containerRef.current, chartId, useChartStore, {
      ids,
      seriesSelector,
      groupSelector,
      groups,
      groupSpec,
      selectedGroupIndex,
    });

    return () => chartEngine.destroy(chartId);
  }, [chartId]);

  /* ---------------- DATA UPDATE ---------------- */

  useEffect(() => {
    chartEngine.update(chartId);
  }, [ids, selectedGroupIndex, seriesSelector]);

  return <div ref={containerRef} className="h-full w-full" />;
}
