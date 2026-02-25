import { useCallback, useMemo } from "react";
import { useChartStore } from "@modules/charts/apex/store";
import { configGenerator } from "../configs";
import {
  evaluateColorRules,
  FILTER_OPERATION_MAP,
  isBetween,
  SORT_OPERATION_MAP,
} from "@shared/utils";
import { seriesTooltipCallback } from "../tooltip/series.tooltip";
import { computeAggregate } from "@lib/analytics/engine/execute";

/* =========================================================
   🔥 CORE DATA ENGINE (Single Source of Truth)
========================================================= */
function useChartData({
  mode,
  seriesOrder,
  groups,
  selectedGroupIndex,
  seriesById,
  seriesConfig,
  groupSpec,
  schemasById,
  filters,
  sort,
  selection,
  xKey,
}) {
  return useMemo(() => {
    let data = [];

    /* ------------------ NORMALIZE ------------------ */
    if (mode === "SERIES") {
      data = seriesOrder.map((id) => ({
        id,
        source: [id],
      }));
    }

    if (mode === "GROUP_SELECT") {
      const ids = groups?.[selectedGroupIndex ?? 0]?.tradeIds ?? [];
      data = ids.map((id) => ({
        id,
        source: [id],
      }));
    }

    if (mode === "GROUP_AGGREGATE") {
      data =
        groups?.map((g) => ({
          meta: g.meta,
          source: g.tradeIds,
        })) ?? [];
    }

    const keys = Array.from(new Set([...seriesConfig.map((s) => s.key), xKey]));

    data = data.map((item) => {
      const values = {};

      if (mode === "GROUP_AGGREGATE") {
        // compute once
        const computed = computeAggregate({
          ast: groupSpec?.ast,
          getTradeCount: () => item.source.length,
          getTradeValue: (index, key) => {
            const id = item.source[index];
            return id ? seriesById[id]?.[key] : null;
          },
          getSchemaType: (k) => {
            const schema = schemasById?.[k];
            return {
              format: schema?.display?.format,
              type: schema?.semanticType,
            };
          },
        });

        keys.forEach((key) => {
          values[key] = computed;
        });
      } else {
        const trade = seriesById[item.id];

        keys.forEach((key) => {
          values[key] = trade?.[key];
        });
      }

      return { ...item, values };
    });

    /* ------------------ SELECTION ------------------ */
    if (selection.from !== null && selection.to !== null) {
      data = data.slice(selection.from, selection.to);
    }

    /* ------------------ FILTER ------------------ */
    if (filters?.length) {
      data = data.filter((item) =>
        filters.some((f) => {
          const fn = FILTER_OPERATION_MAP[f.operator];
          return fn?.(item.values[f.key], f.value ?? f.from, f.to);
        }),
      );
    }

    /* ------------------ SORT ------------------ */
    if (sort?.key && sort.operator !== "none") {
      const fn = SORT_OPERATION_MAP[sort.operator];
      data = [...data].sort((a, b) => {
        return fn?.(a.values[sort.key], b.values[sort.key]) ?? 0;
      });
    }

    return data;
  }, [
    mode,
    seriesOrder,
    groups,
    selectedGroupIndex,
    seriesById,
    seriesConfig,
    groupSpec,
    schemasById,
    filters,
    sort,
    selection,
    xKey,
  ]);
}

/* =========================================================
   MAIN HOOK
========================================================= */
export default function useSeriesChartConfig({
  chartId,
  layout,
  groups,
  groupSpec,
  selectedGroupIndex,
  seriesOrder,
  seriesById,
  seriesConfig,
  selectedSeriesKeys,
  schemasById,
}) {
  const type = useChartStore((s) => s.charts[chartId].meta.type);

  const filters = useChartStore((s) => s.charts[chartId].filters);
  const sort = useChartStore((s) => s.charts[chartId].sort);
  const selection = useChartStore((s) => s.charts[chartId].selection);
  const xKey = useChartStore((s) => s.charts[chartId].xSeriesConfig.key);

  /* ------------------ MODE ------------------ */
  const mode = useMemo(() => {
    if (!groups) return "SERIES";
    if (groupSpec?.ast) return "GROUP_AGGREGATE";
    return "GROUP_SELECT";
  }, [groups, groupSpec]);

  /* ------------------ CORE DATA ------------------ */
  const finalData = useChartData({
    mode,
    seriesOrder,
    groups,
    selectedGroupIndex,
    seriesById,
    seriesConfig: selectedSeriesKeys?.length
      ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
      : seriesConfig,
    groupSpec,
    schemasById,
    filters,
    sort,
    selection,
    xKey,
  });

  /* ------------------ SERIES ------------------ */
  const computedSeries = useMemo(() => {
    return (
      selectedSeriesKeys?.length
        ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
        : seriesConfig
    ).map((s) => ({
      name: s.name,
      data: finalData.map((item) => item.values[s.key]),
      color:
        type === "line"
          ? s.color
          : ({ value }) => evaluateColorRules(value, s.colorRules)?.color,
    }));
  }, [finalData, seriesConfig, selectedSeriesKeys, type]);

  /* ------------------ TOOLTIP ------------------ */
  const tooltipCallback = useCallback(
    (seriesValue, index, seriesIndex) =>
      seriesTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId,
        getTitle: (i, key) => {
          const item = finalData[i];
          return mode === "GROUP_AGGREGATE" ? item.meta : item.values[key];
        },
        selectedSeriesKeys,
        mode,
      }),
    [chartId, finalData, selectedSeriesKeys, mode],
  );

  /* ------------------ OPTIONS ------------------ */
  const options = useMemo(() => {
    return configGenerator?.[type]?.({
      chart: useChartStore.getState().charts[chartId],
      chartId,
      seriesById,

      data: finalData,

      selectedSeriesKeys,
      tooltipCallback,
      mode,
    });
  }, [
    type,
    chartId,
    finalData,
    seriesById,
    selectedSeriesKeys,
    layout,
    layout?.area,
    mode,
    tooltipCallback,
  ]);

  return { options, series: computedSeries, type };
}
