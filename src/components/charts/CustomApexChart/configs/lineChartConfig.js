import { cartesianChartConfig } from "./cartesianChartConfig";

export const getLineChartConfig = ({ chart, chartId, tooltipCallback }) => {
  const config = chart.live.layout;
  const series = chart.series.filtered;
  const seriesConfig = chart.live.seriesConfig;

  const base = cartesianChartConfig({
    chart,
    chartId,
    tooltipCallback,
  });

  return {
    ...base,
    chart: {
      ...base.chart,
      type: config?.area ? "area" : "line",
      stacked: false,
      toolbar: {
        ...base.chart.toolbar,
        tools: { ...base.chart.toolbar.tools, selection: series.length > 1 },
      },
    },
    stroke: { curve: config.curve || "smooth", width: config.strokeWidth || 2 },
    markers: {
      size: config.markerSize || 0,
      colors:
        chart.runtime.selectedLegendIndex !== null
          ? seriesConfig[chart.runtime.selectedLegendIndex].markerColor
          : seriesConfig?.map((s) => s.markerColor) || ["var(--color-default)"],
      strokeWidth: 0,
      hover: { size: config.markerHoverSize || 6 },
    },
    xaxis: base.xaxis,
    yaxis: base.yaxis,

    ...(config.area
      ? {
          fill: {
            opacity: config.areaOpacityFrom || 0.3,
            type: "gradient",
            gradient: {
              shade: "light",
              type: config.areaGradientHorizontal ? "horizontal" : "vertical", // horizontal or vertical
              shadeIntensity: 0,
              gradientToColors: seriesConfig?.map((s) => s.areaColor) || [
                "var(--color-default)",
              ],
              opacityFrom: config.areaOpacityFrom || 0.3,
              opacityTo: config.areaOpacityTo || 0.05,
              stops: [0, 100],
            },
          },
        }
      : {}),
  };
};
