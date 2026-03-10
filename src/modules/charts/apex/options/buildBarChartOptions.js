import { buildCartesianChartOptions } from "./cartesian";

export const buildBarChartOptions = (params) => {
  const { layout } = params;

  const base = buildCartesianChartOptions(params);

  return {
    ...base,

    chart: {
      ...base.chart,
      height: "100%",
      width: "100%",
      type: "bar",
      stacked: layout.stacked,
      stackType: layout.stacked100 ? "100%" : "normal",
    },

    plotOptions: {
      bar: {
        horizontal: layout.horizontal,
        columnWidth: "75%",
        borderRadius: layout.barRadius,
        distributed: false,
      },
    },

    xaxis: layout.horizontal ? base.yaxis : base.xaxis,
    yaxis: layout.horizontal ? base.xaxis : base.yaxis,
  };
};
