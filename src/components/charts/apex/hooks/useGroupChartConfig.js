import { useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { tooltipCallback } from "../tooltip/tootipCallback";
import { WIN_RATE_N } from "@lib/analytics/reducers";

const getSeries = ({ seriesConfig, seriesById, seriesOrder }) => {
  const series = seriesConfig.map((s) => {
    if (s.key === "Wins") {
      const state = WIN_RATE_N.init(seriesOrder.length);

      seriesOrder.forEach((id) => {
        WIN_RATE_N.step(state, seriesById[id].pnl);
      });

      return WIN_RATE_N.result(state) * 100;
    }

    const state = WIN_RATE_N.init(seriesOrder.length);

    seriesOrder.forEach((id) => {
      WIN_RATE_N.step(state, seriesById[id].pnl);
    });

    return 100 - WIN_RATE_N.result(state) * 100;
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
