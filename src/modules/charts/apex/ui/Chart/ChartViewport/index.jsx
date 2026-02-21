import styles from "../CustomApexChart.module.css";
import { AxisSeriesChartViewport } from "./AxisSeriesChartViewport";
import { GroupChartViewport } from "./GroupChartViewport";
import { SeriesChartViewport } from "./SeriesChartViewport";

const ViewPort = ({ props }) => {
  switch (props.category) {
    case "group":
      return <GroupChartViewport {...props} />;
    case "axis-series":
      return <AxisSeriesChartViewport {...props} />;
    default:
      return <SeriesChartViewport {...props} />;
  }
};

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
