import { useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { tooltipCallback } from "../tooltip/tootipCallback";

const seriesGenerator = {
  bar: ({ seriesConfig, seriesById, filteredOrder }) => {
    return seriesConfig.map((s) => ({
      name: s.name,
      data: filteredOrder.map((id) => seriesById[id]?.[s.key]),
      color: ({ value }) =>
        s.colors.filter((r) => value >= r.from && value <= r.to)[0]?.color ||
        "var(--info)",
    }));
  },

  line: ({ seriesConfig, seriesById, filteredOrder }) => {
    return seriesConfig.map((s) => ({
      name: s.name,
      data: filteredOrder.map((id) => seriesById[id]?.[s.key]),
      color: s.color,
    }));
  },
};

export default function useSeriesChartConfig({
  chartId,
  layout,
  seriesConfig,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);
  const seriesById = useChartStore((s) => s.seriesById);

  const filteredOrder = useChartStore((s) =>
    s[chartId].sortedOrder.length !== 0
      ? s[chartId].sortedOrder
      : s[chartId].filteredOrder.length !== 0
      ? s[chartId].filteredOrder
      : s.seriesOrder
  );

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        order: filteredOrder,
        seriesById,
        selectedSeriesKeys,
        tooltipCallback: (sv, i, si) =>
          tooltipCallback(sv, i, si, chartId, selectedSeriesKeys),
      }),
      computedSeries: seriesGenerator[type]({
        seriesConfig: selectedSeriesKeys
          ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
          : seriesConfig,
        filteredOrder,
        seriesById,
        layout,
      }),
    }),
    [seriesConfig, layout, selectedSeriesKeys, seriesById, filteredOrder]
  );

  return { options, series: computedSeries, type };
}
