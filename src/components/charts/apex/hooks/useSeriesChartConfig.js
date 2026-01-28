import { useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import {
  evaluateColorRules,
  FILTER_OPERATION_MAP,
  SORT_OPERATION_MAP,
} from "@utils";
import { seriesTooltipCallback } from "../tooltip/series.tooltip";

const seriesGenerator = {
  bar: ({ seriesConfig, seriesById, filteredOrder }) => {
    return seriesConfig.map((s) => ({
      name: s.name,
      data: filteredOrder.map((id) => seriesById[id]?.[s.key]),
      color: ({ value }) => evaluateColorRules(value, s.colorRules)?.color,
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
  seriesOrder,
  seriesById,
  seriesConfig,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);

  const filters = useChartStore((s) => s[chartId].filters);
  const sort = useChartStore((s) => s[chartId].sort);
  const selection = useChartStore((s) => s[chartId].selection);

  const finalOrder = useMemo(() => {
    let order = seriesOrder;

    /* SELECTION */
    if (selection.from !== null && selection.to !== null) {
      order = order.slice(selection.from, selection.to);
    }

    /* FILTER */
    if (filters.length) {
      order = order.filter((id) =>
        filters.some((f) => {
          const fn = FILTER_OPERATION_MAP[f.operator];
          return fn?.(seriesById[id][f.key], f.value, f.value2);
        }),
      );
    }

    /* SORT */
    if (sort.key && sort.operator !== "none") {
      const fn = SORT_OPERATION_MAP[sort.operator];
      order = [...order].sort((a, b) => {
        return fn?.(seriesById[a][sort.key], seriesById[b][sort.key]) ?? 0;
      });
    }

    return order;
  }, [
    seriesOrder,
    seriesById,
    filters,
    sort.key,
    sort.operator,
    selection.from,
    selection.to,
  ]);

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        order: finalOrder,
        seriesById,
        selectedSeriesKeys,
        tooltipCallback: (seriesValue, index, seriesIndex) =>
          seriesTooltipCallback({
            seriesValue,
            index,
            seriesIndex,
            chartId,
            getTitle: (i, key) => seriesById?.[finalOrder[i]]?.[key],
            selectedSeriesKeys,
          }),
      }),
      computedSeries: seriesGenerator[type]({
        seriesConfig: selectedSeriesKeys
          ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
          : seriesConfig,
        filteredOrder: finalOrder,
        seriesById,
      }),
    }),
    [
      seriesConfig,
      layout,
      layout?.area,
      selectedSeriesKeys,
      seriesById,
      finalOrder,
    ],
  );

  return { options, series: computedSeries, type };
}
