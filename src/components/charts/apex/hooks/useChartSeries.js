import { evaluateColorRules } from "@utils";
import { useChartStore } from "../store/useChartStore";

const bar = (chart) => {
  const index = chart.selectedLegendIndex;
  const cfg = index !== null ? [chart.seriesConfig[index]] : chart.seriesConfig;

  return cfg.map((s) => ({
    name: s.name,
    data: chart.series.map((d) => d?.[s.key]),
    color: ({ value }) =>
      s.colors.filter((r) => value >= r.from && value <= r.to)[0]?.color ||
      "var(--info)",
  }));
};

const generateSeries = (cfg, order, idMap, legendIndexes) => {
  const activeCfg = legendIndexes?.length
    ? cfg.filter((_, i) => legendIndexes.includes(i))
    : cfg;

  return activeCfg.map((c) => ({
    name: c.label,
    data: order.map((id) => idMap[id][c.key]),
    color: ({ value }) =>
      evaluateColorRules(value, c.colors)?.color ?? "var(--info)",
  }));
};

const applyFilters = (filters, order, idMap) => {
  return order.filter((id) => {
    const series = idMap[id];
    return filters.some((f) => {
      const fn = filterOperationMap[f.operator];
      return fn?.(series[f.id], f.value, f.value2);
    });
  });
};

export const useChartSeries = (legendIndexes) => {
  const seriesById = useChartStore((s) => s.seriesById);
  const order = useChartStore((s) => s.seriesOrder);

  const xSeriesConfig = useChartStore((s) => s.xSeriesConfig);
  const ySeriesConfig = useChartStore((s) => s.ySeriesConfig);

  const filters = useChartStore((s) => s.filters);
  const sort = useChartStore((s) => s.sort);

  const filteredOrder = filters.length
    ? applyFilters(filters, order, seriesById)
    : order;

  const sortedOrder = sort?.key
    ? [...filteredOrder].sort((a, b) => {
        const va = seriesById[a][sort.key];
        const vb = seriesById[b][sort.key];
        return fn?.(va, vb) ?? 0;
      })
    : filteredOrder;

  const ySeries = generateSeries(
    ySeriesConfig,
    sortedOrder,
    seriesById,
    legendIndexes,
  );

  const xSeries = sortedOrder.map((id) => seriesById[id][xSeriesConfig.key]);

  return { ySeries, xSeries };
};
