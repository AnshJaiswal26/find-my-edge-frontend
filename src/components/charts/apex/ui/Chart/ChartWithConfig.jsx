import Toolbar from "@charts/apex/ui/Toolbar";
import useChartCfgGenerator from "@charts/apex/hooks/useChartCfgGenerator";
import styles from "./CustomApexChart.module.css";
import { ChartLegend } from "./ChartLegend";
import { ChartViewport } from "./ChartViewport";

export function ChartWithConfig({ chartId, type }) {
  const { options, layout, seriesConfig, computedSeries } =
    useChartCfgGenerator({ chartId, type });

  return (
    <div className={styles.chartWrapper}>
      <div
        className={`${styles.legendChartWrapper} ${
          styles[layout.legendPosition]
        }`}
      >
        <ChartLegend
          type={type}
          chartId={chartId}
          legend={layout.legend}
          legendAlignment={layout.legendAlignment}
          seriesConfig={seriesConfig}
        />

        <ChartViewport
          type={type}
          options={options}
          series={computedSeries}
          layout={layout}
        />
      </div>

      <Toolbar type={type} chartId={chartId} />
    </div>
  );
}
