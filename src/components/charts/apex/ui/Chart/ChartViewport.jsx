import ReactApexChart from "react-apexcharts";
import styles from "./CustomApexChart.module.css";

export function ChartViewport({ type, options, series, layout }) {
  const { chartWidth, area } = layout;
  const isZoomedIn = chartWidth === 100 || typeof chartWidth === "string";

  return (
    <div
      data-chart-type={type}
      style={{
        overflowX: isZoomedIn ? "" : "auto",
        overflowY: !isZoomedIn ? "hidden" : "",
      }}
      className={styles.chartZoomWrapper}
    >
      <div className="h-full" style={{ width: `${chartWidth}%` }}>
        <ReactApexChart
          key={area}
          options={options}
          series={series}
          type={area && type === "line" ? "area" : type}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
