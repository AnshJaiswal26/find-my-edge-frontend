import styles from "../CustomApexChart.module.css";
import { ViewPort } from "./ViewPort";

export function ChartViewport(props) {
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
      <div className="h-full" style={{ width: `${chartWidth}%` }}>
        <ViewPort props={props} />
      </div>
    </div>
  );
}
