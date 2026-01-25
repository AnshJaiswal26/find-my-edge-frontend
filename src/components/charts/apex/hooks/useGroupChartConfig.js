import { useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { WIN_RATE_N } from "@lib/analytics/engine/functions";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";

const getSeries = ({ seriesConfig, seriesById, seriesOrder }) => {
  const series = seriesConfig.map((s) => {
    if (s.key === "Wins") {
      const state = WIN_RATE_N.init(seriesOrder.length);

      seriesOrder.forEach((id) => {
        WIN_RATE_N.step(state, seriesById[id].pnl);
      });

      return WIN_RATE_N.result(state);
    }

    const state = WIN_RATE_N.init(seriesOrder.length);

    seriesOrder.forEach((id) => {
      WIN_RATE_N.step(state, seriesById[id].pnl);
    });

    return 100 - WIN_RATE_N.result(state);
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
  seriesOrder,
  seriesById,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        seriesById,
        selectedSeriesKeys,
        tooltipCallback: (seriesValue, index, seriesIndex) =>
          groupedTooltipCallback({
            seriesValue,
            index,
            seriesIndex,
            chartId,
            selectedSeriesKeys,
          }),
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
