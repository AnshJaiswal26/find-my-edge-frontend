import styles from "./CustomApexChart.module.css";
import { ChartLegend } from "./ChartLegend";
import { ChartViewport } from "./ChartViewport";
import { useState } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";

export function ChartWithConfig({
  chartId,
  type,
  category,
  seriesById,
  seriesOrder,
}) {
  const layout = useChartStore((s) => s[chartId].layout);
  const seriesConfig = useChartStore(
    (s) => s[chartId].ySeriesConfig ?? s[chartId].seriesConfig,
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
        seriesById={seriesById}
        seriesOrder={seriesOrder}
        selectedSeriesKeys={selectedSeriesKeys}
      />
    </div>
  );
}
