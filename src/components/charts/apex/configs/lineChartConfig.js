import { cartesianChartConfig } from "./cartesianChartConfig";

export const getLineChartConfig = ({
  chart,
  chartId,
  order,
  seriesById,
  tooltipCallback,
}) => {
  const config = chart.layout;
  const index = chart.runtime.selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.seriesConfig[index]] : chart.seriesConfig;

  const base = cartesianChartConfig({
    chart,
    chartId,
    order,
    seriesById,
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
        tools: { ...base.chart.toolbar.tools, selection: order.length > 1 },
      },
    },
    stroke: { curve: config.curve || "smooth", width: config.strokeWidth || 2 },
    markers: {
      size: config.markerSize || 0,
      colors: seriesConfig?.map((s) => s.markerColor) || ["var(--info)"],
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
                "var(--info)",
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
