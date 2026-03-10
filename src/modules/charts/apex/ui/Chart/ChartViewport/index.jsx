import styles from "../CustomApexChart.module.css";
import { AxisSeriesChartViewport } from "./AxisSeriesChartViewport";
import { CartesianChartViewport } from "./CartesianChartViewport";
import { GroupChartViewport } from "./GroupChartViewport";
// import { ViewPort } from "./ViewPort";

const ViewPort = (props) => {
  switch (props.category) {
    case "group":
      return <GroupChartViewport {...props} />;
    case "axis-series":
      return <AxisSeriesChartViewport {...props} />;
    default:
      return <CartesianChartViewport {...props} />;
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
        <ViewPort {...props} />
      </div>
    </div>
  );
}

// import { useEffect, useRef } from "react";
// import { chartEngine } from "../../../model/chartEngine";
// import { useChartStore } from "@modules/charts/apex/store";

// export function ChartViewport({
//   chartId,
//   ids,
//   seriesSelector,
//   groups,
//   groupSpec,
//   selectedGroupIndex,
// }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     if (!ref.current) return;

//     chartEngine.create(ref.current, chartId, useChartStore, {
//       ids,
//       seriesSelector,
//       groups,
//       groupSpec,
//       selectedGroupIndex,
//     });

//     return () => chartEngine.destroy(chartId);
//   }, [chartId]);

//   useEffect(() => {
//     chartEngine.update(chartId);
//   }, [ids, selectedGroupIndex]);

//   return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
// }
