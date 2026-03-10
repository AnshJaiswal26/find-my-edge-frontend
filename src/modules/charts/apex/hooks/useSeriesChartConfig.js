import { useCallback, useMemo } from "react";
import { useChartStore } from "@modules/charts/apex/store";
import {
  evaluateColorRules,
  FILTER_OPERATION_MAP,
  SORT_OPERATION_MAP,
} from "@shared/utils";
import { seriesTooltipCallback } from "../tooltip/series.tooltip";
import { useLineChartConfig, useBarChartConfig } from "../configs";

function useChartEngine({ ids, seriesSelector, filters, sort, selection }) {
  return useMemo(() => {
    let result = ids;

    /* ---------------- FILTER ---------------- */

    if (filters?.length) {
      result = result.filter((id) =>
        filters.some((f) => {
          const fn = FILTER_OPERATION_MAP[f.operator];
          const value = seriesSelector(id, f.key);

          return fn?.(value, f.value ?? f.from, f.to);
        }),
      );
    }

    /* ---------------- SORT ---------------- */

    if (sort?.key && sort.operator !== "none") {
      const fn = SORT_OPERATION_MAP[sort.operator];

      result = [...result].sort((a, b) => {
        const v1 = seriesSelector(a, sort.key);
        const v2 = seriesSelector(b, sort.key);

        return fn?.(v1, v2) ?? 0;
      });
    }

    /* ---------------- SELECTION ---------------- */

    if (selection?.from !== null && selection?.to !== null) {
      result = result.slice(selection.from, selection.to);
    }

    return result;
  }, [ids, filters, sort, selection, seriesSelector]);
}

function useChartSeries({ ids, series, type, seriesSelector }) {
  return useMemo(() => {
    return series.map((s) => ({
      name: s.label,

      data: ids.map((id) => seriesSelector(id, s.field)),

      color:
        type === "line"
          ? s.color
          : ({ value }) => evaluateColorRules(value, s.colorRules)?.color,
    }));
  }, [ids, series, type, seriesSelector]);
}

function useChartTooltip({ chartId, ids, selectedSeriesIds, seriesSelector }) {
  return useCallback(
    (seriesValue, index, seriesIndex) =>
      seriesTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId,
        getTitle: (field) => seriesSelector(ids[index], field),
        selectedSeriesIds,
      }),
    [chartId, ids, selectedSeriesIds],
  );
}

export function useSeriesChartOptions(params) {
  const lineConfig = useLineChartConfig(params);
  const barConfig = useBarChartConfig(params);

  return params.type === "line" ? lineConfig : barConfig;
}

/* =========================================================
   MAIN HOOK
========================================================= */
export default function useSeriesChartConfig({
  ids,
  chartId,
  layout,
  selectedSeriesIds,
  seriesSelector,
  groupSelector,
  seriesConfig,
}) {
  const type = useChartStore((s) => s.charts[chartId].type);
  const mode = useChartStore((s) => s.charts[chartId].mode);

  const xMetric = useChartStore((s) => s.charts[chartId].xMetric);

  const filters = useChartStore((s) => s.charts[chartId].filters);
  const sort = useChartStore((s) => s.charts[chartId].sort);
  const selection = useChartStore((s) => s.charts[chartId].selection);

  const filteredSeries = useMemo(
    () =>
      selectedSeriesIds?.length
        ? seriesConfig.filter((s) => selectedSeriesIds.includes(s.id))
        : seriesConfig,
    [selectedSeriesIds, seriesConfig],
  );

  /* ------------------ CORE DATA ------------------ */
  const finalIds = useChartEngine({
    ids,
    seriesSelector,
    filters,
    sort,
    selection,
  });

  /* ------------------ SERIES ------------------ */
  const computedSeries = useChartSeries({
    ids: finalIds,
    series: filteredSeries,
    selectedSeriesIds,
    type,
    seriesSelector,
  });

  /* ------------------ TOOLTIP ------------------ */
  const tooltipCallback = useChartTooltip({
    chartId,
    ids: finalIds,
    selectedSeriesIds,
    seriesSelector,
  });

  /* ------------------ OPTIONS ------------------ */
  const options = useSeriesChartOptions({
    ids,
    type,
    chartId,
    layout,
    seriesSelector,
    tooltipCallback,
    series: filteredSeries,
    mode,
    xMetric,
    groupSelector,
  });

  return { options, series: computedSeries, type };
}
