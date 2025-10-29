import { cartesianChartConfig } from "../CartesianChart/cartesianChartConfig";

export const getLineChartConfig = ({
  config,
  chartRef,
  chartId,
  series,
  tooltipCallBack,
}) => {
  const base = cartesianChartConfig({
    config,
    chartRef,
    chartId,
    series,
    tooltipCallBack,
  });

  return {
    ...base,
    chart: {
      ...base.chart,
      type: config.area ? "area" : "line",
      stacked: false,
      toolbar: {
        ...base.chart.toolbar,
        tools: { ...base.chart.toolbar.tools, selection: series.length > 1 },
      },
    },
    stroke: { curve: config.curve || "smooth", width: config.strokeWidth || 2 },
    markers: {
      size: config.markerSize || 0,
      colors: config.markerColors || ["var(--color-default)"],
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
              gradientToColors:
                config.areaColors?.length > 0
                  ? config.areaColors
                  : ["var(--color-cyan)"],
              opacityFrom: config.areaOpacityFrom || 0.3,
              opacityTo: config.areaOpacityTo || 0.05,
              stops: [0, 100],
            },
          },
        }
      : {}),
  };
};
