import { useChartStore } from "@charts/apex/store/useChartStore";
import styles from "./CustomApexChart.module.css";

export function ChartTitle({ chartId }) {
  const title = useChartStore((s) => s[chartId].layout.title);
  return (
    <div className={styles.chartTitleWrapper}>
      <span>{title}</span>
    </div>
  );
}
