import { useCallback, useMemo } from "react";
import { useChartStore } from "@modules/charts/apex/store";
import { configGenerator } from "../configs";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";
import { computedAggregate } from "@lib/analytics/engine/execute";

const getSeries = ({ seriesConfig, seriesById, seriesOrder, schemasById }) => {
  const series = seriesConfig.map((s) => {
    const value = computedAggregate({
      ast: s.ast,
      getTradeCount: () => seriesOrder.length,
      getTradeValue: (index, key) => {
        if (index < 0) return null;
        const id = seriesOrder[index];
        return id ? seriesById[id]?.[key] : null;
      },
      getSchemaType: (key) => {
        const schema = schemasById[key];
        return { format: schema?.display?.format, type: schema.semanticType };
      },
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
  seriesConfig,
  seriesOrder,
  seriesById,
  schemasById,
  selectedSeriesKeys,
}) {
  const type = useChartStore((s) => s.charts[chartId].meta.type);

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
    });
  }, [type, filteredConfig, seriesOrder, seriesById, schemasById]);

  const tooltipCb = useCallback(
    (seriesValue, index, seriesIndex) =>
      groupedTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId,
        filteredConfig, // ✅ pass filtered config
        series: computedSeries, // ✅ pass actual data
      }),
    [chartId, selectedSeriesKeys, computedSeries],
  );

  const options = useMemo(() => {
    return configGenerator?.[type]?.({
      chart: useChartStore.getState().charts[chartId],
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
