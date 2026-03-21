import { useEffect, useRef } from "react";
import { chartEngine } from "@modules/charts/apex/model/chartEngine";
import { useChartStore } from "@modules/charts/apex/store";

export function ChartViewport({ chartId, dataset }) {
  const containerRef = useRef(null);

  /* ---------------- CREATE CHART ---------------- */

  useEffect(() => {
    if (!containerRef.current) return;

    chartEngine.create(containerRef.current, chartId, useChartStore);

    chartEngine.setDataset(chartId, dataset);

    return () => chartEngine.destroy(chartId);
  }, [chartId]);

  /* ---------------- DATA UPDATE ---------------- */

  useEffect(() => {
    chartEngine.updateDataset(chartId, dataset);
  }, [chartId, dataset]);

  return <div ref={containerRef} className="h-full w-full" />;
}
