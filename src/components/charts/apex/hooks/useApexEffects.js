import ApexCharts from "apexcharts";

export default function useApexEffects({
  chartId,
  series,
  seriesConfig,
  layout,
  selectedLegendIndex,
}) {
  useEffect(() => {
    const listener = (e) => {
      if (e.detail?.chartId === chartId) {
        ApexCharts.exec(chartId, "resize");
      }
    };
    window.addEventListener("chart-resize", listener);
    return () => window.removeEventListener("chart-resize", listener);
  }, []);

  useEffect(() => {
    if (type === "radialBar" || type === "donut") {
      ApexCharts.exec(chartId, "updateSeries", series, true);
    }
  }, [seriesConfig, layout, selectedLegendIndex]);
}
