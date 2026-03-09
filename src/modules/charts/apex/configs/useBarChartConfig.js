import { useCartesianChartConfig } from "./cartesian";

export const useBarChartConfig = (params) => {
  const { layout } = params;

  const base = useCartesianChartConfig(params);

  return useMemo(
    () => ({
      ...base,

      chart: {
        ...base.chart,
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
    }),
    [
      base,
      layout.horizontal,
      layout.stacked,
      layout.stacked100,
      layout.barRadius,
    ],
  );
};
