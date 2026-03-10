import { useCallback, useMemo } from "react";
import { useChartStore } from "@modules/charts/apex/store";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";
import { useRadialBarChartConfig, usePieChartConfig } from "../configs";

function useGroupChartOptions(params) {
  const radialBarOptions = useRadialBarChartConfig(params);
  const pieOptions = usePieChartConfig(params);

  return params.type === "radialBar" ? radialBarOptions : pieOptions;
}

export default function useGroupChartConfig({
  chartId,
  layout,
  selectedSeriesIds,
}) {
  const type = useChartStore((s) => s.charts[chartId].type);
  const series = useChartStore((s) => s.charts[chartId].series);

  const filteredSeries = useMemo(
    () =>
      selectedSeriesIds?.length
        ? series.filter((s) => selectedSeriesIds.includes(s.id))
        : series,
    [selectedSeriesIds, series],
  );

  console.log(filteredSeries);

  const computedSeries = useMemo(
    () => filteredSeries.map((c) => c.value),
    [filteredSeries],
  );
  console.log(computedSeries);

  const tooltipCallback = useCallback(
    (seriesValue, index, seriesIndex) =>
      groupedTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId,
        filteredSeries,
        dataSeries: computedSeries,
      }),
    [chartId, selectedSeriesIds, computedSeries],
  );

  const options = useGroupChartOptions({
    layout,
    tooltipCallback,
    filteredSeries,
    dataSeries: computedSeries,
  });

  return {
    options,
    series: computedSeries.map(Math.abs),
    type,
  };
}
