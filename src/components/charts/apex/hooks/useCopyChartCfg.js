import { useEffect, useMemo } from "react";
import { useChartStore } from "../store/useChartStore";
import { configGenerator } from "../configs";
import ApexCharts from "apexcharts";
import { tooltipCallback } from "../tooltip/tootipCallback";

import { filterOperationMap, sortOperationMap } from "@utils";

export function evaluateColorRules(value, rules = []) {
  const sorted = [...rules].sort((a, b) => {
    // numeric rules → higher value first
    if (a.operator === "greaterThan" && b.operator === "greaterThan") {
      return b.value - a.value;
    }
    return 0;
  });

  for (const rule of sorted) {
    const fn = filterOperationMap[rule.operator];
    if (!fn) continue;

    if (fn(value, rule.value, rule?.value2)) {
      return rule.color;
    }
  }

  return null;
}

export const applyFilters = (filters, order, idMap) => {
  if (!filters?.length) return order;

  return order.filter((id) =>
    filters.every((f) => {
      const fn = filterOperationMap[f.operator];
      return fn?.(idMap[id][f.key], f.value, f.value2);
    })
  );
};

export const applySort = (sort, order, idMap) => {
  if (!sort?.key || sort.operator === "none") return order;

  const fn = sortOperationMap[sort.operator];
  if (!fn) return order;

  return [...order].sort((a, b) => fn(idMap[a][sort.key], idMap[b][sort.key]));
};

const getCircularChartSeries = (chart) => {
  const index = chart.selectedLegendIndex;
  return index !== null ? [chart.series[index]] : chart.series;
};

const getActiveSeriesConfig = (
  seriesConfig,
  selectedLegendIndexes,
  allowMultiple = true
) => {
  if (!selectedLegendIndexes?.length) return seriesConfig;

  if (!allowMultiple) {
    return [seriesConfig[selectedLegendIndexes[0]]];
  }

  return seriesConfig.filter((_, i) => selectedLegendIndexes.includes(i));
};

const seriesGenerator = {
  bar: ({ series, seriesConfig, selectedLegendIndexes }) => {
    const cfg = getActiveSeriesConfig(
      seriesConfig,
      selectedLegendIndexes,
      true
    );

    return cfg.map((s) => ({
      name: s.label ?? s.name,
      data: series.map((d) => d[s.key]),
      color: ({ value }) => evaluateColorRules(value, c.colors),
    }));
  },

  line: ({ series, seriesConfig, selectedLegendIndexes }) => {
    const cfg = getActiveSeriesConfig(
      seriesConfig,
      selectedLegendIndexes,
      true
    );

    return cfg.map((s) => ({
      name: s.label ?? s.name,
      data: series.map((d) => d[s.key]),
      color: s.color,
    }));
  },

  donut: getCircularChartSeries,
  radialBar: getCircularChartSeries,

  radar: ({ series, seriesConfig, selectedLegendIndexes }) => {
    const cfg = getActiveSeriesConfig(
      seriesConfig,
      selectedLegendIndexes,
      true
    );

    const getValues = (s) => series.map((d) => Number(d[s.key] ?? 0));

    return cfg.map((s) => ({
      name: s.name,
      data: getValues(s),
      color: s.color,
    }));
  },

  polarArea: ({ series, seriesConfig, selectedLegendIndexes }) => {
    return series.map((s) => s.data);
  },
};

export default function useChartCfgGenerator2({
  chartId,
  type,
  selectedLegendIndexes,
}) {
  const {
    layout,
    seriesConfig,
    xSeriesConfig,
    seriesById,
    seriesOrder,
    filters,
    sort,
    selectedLegendIndex,
  } = useChartStore((s) => ({
    layout: s[chartId].layout,
    seriesConfig: s[chartId].ySeriesConfig,
    xSeriesConfig: s[chartId].xSeriesConfig,
    seriesById: s.seriesById,
    seriesOrder: s.seriesOrder,
    filters: s[chartId].filters,
    sort: s[chartId].sort,
  }));

  //   const layout = useChartStore((s) => s[chartId].layout);
  //   const seriesConfig = useChartStore((s) => s[chartId].ySeriesConfig);
  //   const xSeriesConfig = useChartStore((s) => s[chartId].xSeriesConfig);
  //   const layout = useChartStore((s) => s.seriesById);
  //   const layout = useChartStore((s) => s.seriesOrder);
  //   const layout = useChartStore((s) => s.seriesOrder);

  const { options, computedSeries } = useMemo(() => {
    // 1️⃣ filter + sort IDs
    const filteredOrder = applyFilters(filters, seriesOrder, seriesById);
    const sortedOrder = applySort(sort, filteredOrder, seriesById);

    // 2️⃣ materialize rows (only here)
    const orderedSeries = sortedOrder.map((id) => seriesById[id]);

    return {
      options: configGenerator[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        tooltipCallback: (v, i, si) => tooltipCallback(v, i, si, type, chartId),
      }),

      computedSeries: seriesGenerator[type]({
        series: orderedSeries,
        seriesConfig,
        selectedLegendIndexes,
        layout,
      }),
    };
  }, [
    chartId,
    type,
    seriesOrder,
    seriesById,
    filters,
    sort,
    seriesConfig,
    selectedLegendIndexes,
    layout,
  ]);

  // 🔁 resize listener
  useEffect(() => {
    const listener = (e) => {
      if (e.detail?.chartId === chartId) {
        ApexCharts.exec(chartId, "resize");
      }
    };

    window.addEventListener("chart-resize", listener);
    return () => window.removeEventListener("chart-resize", listener);
  }, [chartId]);

  // 🔄 Apex circular chart update
  useEffect(() => {
    if (type === "radialBar" || type === "donut") {
      ApexCharts.exec(chartId, "updateSeries", computedSeries, true);
    }
  }, [computedSeries, chartId, type]);

  return { options, computedSeries, seriesConfig, layout };
}
