import { cartesianChartConfig } from "./cartesianChartConfig";

export const getBarChartConfig = ({
  chart,
  chartId,
  data,
  seriesById,
  selectedSeriesKeys,
  tooltipCallback,
  mode,
}) => {
  const config = chart.layout;

  const base = cartesianChartConfig({
    chart,
    chartId,
    data,
    seriesById,
    selectedSeriesKeys,
    tooltipCallback,
    mode,
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
        tools: { ...base.chart.toolbar.tools, selection: data.length > 1 },
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
  };
};
