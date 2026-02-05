import { useCallback, useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";

import {
  COMPUTATION_MODE,
  computeOverSequence,
} from "@lib/analytics/engine/execute";

const getSeries = ({ seriesConfig, seriesById, seriesOrder, schemasById }) => {
  const series = seriesConfig.map((s) => {
    const value = computeOverSequence({
      schema: { expression: s.expression },
      getTradeAt: (index) => {
        if (index < 0) return null;
        const id = seriesOrder[index];
        return id ? seriesById[id] : null;
      },
      getTradeCount: () => seriesOrder.length,
      getSchemaType: (key) => {
        const schema = schemasById[key];
        return { format: schema?.display?.format, type: schema.type };
      },
      getValue: (trade, key) => trade[key] ?? null,
      setValue: () => null,
      mode: COMPUTATION_MODE.AGGREGATE,
    });
    return value;
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
  groups,
  seriesConfig,
  seriesOrder,
  seriesById,
  schemasById,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);

  const filteredConfig = useMemo(
    () =>
      selectedSeriesKeys
        ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
        : seriesConfig,
    [seriesConfig, selectedSeriesKeys],
  );

  const computedSeries = useMemo(() => {
    return seriesGenerator[type]({
      seriesConfig: filteredConfig,
      seriesOrder,
      seriesById,
      schemasById,
      groups,
    });
  }, [type, filteredConfig, seriesOrder, seriesById, groups, schemasById]);

  const tooltipCb = useCallback(
    (seriesValue, index, seriesIndex) =>
      groupedTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId,
        filteredConfig, // ✅ pass filtered config
        series: computedSeries, // ✅ pass actual data
        groups,
      }),
    [chartId, selectedSeriesKeys, groups, computedSeries],
  );

  const options = useMemo(() => {
    return configGenerator?.[type]?.({
      chart: useChartStore.getState()[chartId],
      chartId,
      seriesById,
      filteredConfig,
      series: computedSeries,
      tooltipCallback: tooltipCb,
      layout,
    });
  }, [
    type,
    chartId,
    layout,
    seriesById,
    filteredConfig,
    tooltipCb,
    computedSeries,
  ]);

  return {
    options,
    series: computedSeries.map((v) => Math.abs(v)),
    type,
  };
}
