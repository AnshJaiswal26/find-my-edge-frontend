import Toolbar from "../Toolbar";
import { ChartContainer } from "./ChartContainer";
import { ChartTitle } from "./ChartTitle";
import { ChartWithConfig } from "./ChartWithConfig";
import styles from "./CustomApexChart.module.css";

export default function CustomApexChart({ chartId, type }) {
  return (
    <ChartContainer chartId={chartId}>
      <ChartTitle chartId={chartId} />
      <div className={styles.chartWrapper}>
        <ChartWithConfig chartId={chartId} type={type} />
        <Toolbar type={type} chartId={chartId} />
      </div>
    </ChartContainer>
  );
}
