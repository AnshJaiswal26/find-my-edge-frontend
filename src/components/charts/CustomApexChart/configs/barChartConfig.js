import { cartesianChartConfig } from "./cartesianChartConfig";

export const getBarChartConfig = ({ chart, chartId, tooltipCallback }) => {
  const config = chart.live.layout;
  const series = chart.series.filtered;

  const base = cartesianChartConfig({
    chart,
    chartId,
    tooltipCallback,
  });

  return {
    ...base,
    chart: {
      ...base.chart,
      type: "bar",
      stacked: config.stacked,
      stackType: config.stacked100 ? "100%" : "normal",
      toolbar: {
        ...base.chart.toolbar,
        tools: { ...base.chart.toolbar.tools, selection: series.length > 1 },
      },
    },

    plotOptions: {
      bar: {
        horizontal: config.horizontal,
        columnWidth: "75%",
        borderRadius: config.barRadius,
        distributed: false,
      },
    },
    xaxis: config.horizontal ? base.yaxis : base.xaxis,
    yaxis: config.horizontal ? base.xaxis : base.yaxis,
    dataLabels: { enabled: config.dataLabels, style: { fontSize: "0.75rem" } },
  };
};
