import { useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { tooltipCallback } from "../tooltip/tootipCallback";

const getSeries = ({ seriesConfig, seriesById, seriesOrder }) => {
  const series = seriesConfig.map((s) => {
    if (s.key === "Wins") {
      return (
        (seriesOrder.reduce((acc, id) => {
          acc = seriesById[id].Pnl > 0 ? acc + 1 : acc;
          return acc;
        }, 0) /
          seriesOrder.length) *
        100
      );
    }
    return (
      (seriesOrder.reduce((acc, id) => {
        acc = seriesById[id].Pnl < 0 ? acc + 1 : acc;
        return acc;
      }, 0) /
        seriesOrder.length) *
      100
    );
  });
  return series;
};

const seriesGenerator = {
  donut: getSeries,
  radialBar: getSeries,
};

export default function useGroupChartConfig({
  chartId,
  layout,
  seriesConfig,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);

  const seriesById = useChartStore((s) => s.seriesById);
  const seriesOrder = useChartStore((s) => s.seriesOrder);

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        seriesById,
        selectedSeriesKeys,
        tooltipCallback: (sv, i, si) =>
          tooltipCallback(sv, i, si, chartId, seriesOrder, selectedSeriesKeys),
      }),
      computedSeries: seriesGenerator[type]({
        seriesConfig: selectedSeriesKeys
          ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
          : seriesConfig,
        seriesOrder,
        seriesById,
      }),
    }),
    [seriesConfig, layout, selectedSeriesKeys, seriesById, seriesOrder],
  );

  return {
    options,
    series: computedSeries,
    type,
  };
}
