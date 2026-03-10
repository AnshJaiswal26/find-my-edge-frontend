import styles from "./CustomApexChart.module.css";
import { ChartLegend } from "./ChartLegend";
import { ChartViewport } from "./ChartViewport";
import { useState } from "react";
import { useChartStore } from "@modules/charts/apex/store";

export function ChartWithConfig({
  chartId,
  type,
  category,
  groups,
  groupSpec,
  selectedGroupIndex,
  ids,
  seriesSelector,
}) {
  const layout = useChartStore((s) => s.charts[chartId].layout);
  const seriesConfig = useChartStore((s) => s.charts[chartId].series);

  const [selectedSeriesIds, setSelectedSeriesIds] = useState(null);

  return (
    <div
      className={`${styles.legendChartWrapper} ${
        styles[layout.legendPosition]
      }`}
    >
      <ChartLegend
        type={type}
        show={layout.legend}
        alignment={layout.legendAlignment}
        seriesConfig={seriesConfig}
        selectedSeriesIds={selectedSeriesIds}
        setSelectedSeriesIds={setSelectedSeriesIds}
      />

      <ChartViewport
        type={type}
        category={category}
        chartId={chartId}
        layout={layout}
        seriesConfig={seriesConfig}
        groups={groups}
        groupSpec={groupSpec}
        selectedGroupIndex={selectedGroupIndex}
        ids={ids}
        seriesSelector={seriesSelector}
        selectedSeriesIds={selectedSeriesIds}
      />
    </div>
  );
}
