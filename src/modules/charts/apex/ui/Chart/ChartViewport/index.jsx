import styles from "../CustomApexChart.module.css";
import { ChartViewport } from "./ChartViewportWrapper";

export function ChartViewportWrapper(props) {
  const { chartWidth } = props.layout;
  const isZoomedIn = chartWidth === 100 || typeof chartWidth === "string";

  return (
    <div
      data-chart-type={props.type}
      style={{
        overflowX: isZoomedIn ? "" : "auto",
        overflowY: !isZoomedIn ? "hidden" : "",
      }}
      className={styles.chartZoomWrapper}
    >
      <div className="h-full relative" style={{ width: `${chartWidth}%` }}>
        <ChartViewport {...props} />
      </div>
    </div>
  );
}
