import { baseChartConfig } from "./baseChartConfig";

export const getLineChartConfig = ({
  config,
  chartRef,
  chartId,
  series,
  tooltipCallBack,
}) => {
  const base = baseChartConfig({
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
      type: "line",
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
  };
};
