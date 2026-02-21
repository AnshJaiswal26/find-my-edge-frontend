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
  seriesById,
  seriesOrder,
  schemasById,
  schemasOrder,
}) {
  const layout = useChartStore((s) => s.charts[chartId].layout);
  const seriesConfig = useChartStore(
    (s) => s.charts[chartId].ySeriesConfig ?? s.charts[chartId].seriesConfig,
  );

  const [selectedSeriesKeys, setSelectedSeriesKeys] = useState(null);

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
        selectedSeriesKeys={selectedSeriesKeys}
        setSelectedSeriesKeys={setSelectedSeriesKeys}
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
        seriesById={seriesById}
        seriesOrder={seriesOrder}
        schemasById={schemasById}
        schemasOrder={schemasOrder}
        selectedSeriesKeys={selectedSeriesKeys}
      />
    </div>
  );
}
