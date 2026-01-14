import { Legend } from "@layout";
import { useChartStore } from "@stores";
import styles from "./CustomApexChart.module.css";

export function ChartLegend({
  chartId,
  type,
  legend,
  legendAlignment,
  seriesConfig,
}) {
  const selectedLegendIndex = useChartStore(
    (s) => s[chartId].runtime.selectedLegendIndex
  );
  const updateChart = useChartStore((s) => s.updateChart);

  if (!legend) return null;

  return (
    <div className={`${styles.legendWrapper} ${styles[legendAlignment]}`}>
      {seriesConfig.map((s, i) => (
        <Legend
          key={i}
          color={type === "bar" ? s.colors.map((r) => r.color) : s.color}
          label={s.name ?? s.label}
          selected={selectedLegendIndex !== null && selectedLegendIndex !== i}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.runtime.selectedLegendIndex =
                chart.runtime.selectedLegendIndex === i ? null : i;
            })
          }
        />
      ))}
    </div>
  );
}
