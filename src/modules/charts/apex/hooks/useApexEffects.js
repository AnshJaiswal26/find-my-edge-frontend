import ApexCharts from "apexcharts";
import { useEffect } from "react";

export default function useApexEffects(props) {
  useEffect(() => {
    const listener = (e) => {
      if (e.detail?.chartId === props.chartId) {
        ApexCharts.exec(props.chartId, "resize");
      }
    };
    window.addEventListener("chart-resize", listener);
    return () => window.removeEventListener("chart-resize", listener);
  }, []);

  useEffect(() => {
    if (props.type === "radialBar" || props.type === "donut") {
      ApexCharts.exec(props.chartId, "updateSeries", props.series, true);
    }
  }, [props.seriesConfig, props.layout, props.selectedSeriesKeys]);
}
