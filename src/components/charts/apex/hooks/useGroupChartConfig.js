import { useCallback, useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";

const getSeries = ({ seriesConfig, seriesById, seriesOrder }) => {
  const series = seriesConfig.map((s) => {
    const reducer = WINDOW_FUNCTIONS[s.reducer].reducer;

    const state = reducer.init(seriesOrder.length);

    seriesOrder.forEach((id) => {
      reducer.step(state, seriesById[id][s.seriesKey]);
    });

    return reducer.result(state);
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
    });
  }, [type, filteredConfig, seriesOrder, seriesById]);

  console.log(filteredConfig);

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
    [chartId, selectedSeriesKeys],
  );

  const options = useMemo(() => {
    return configGenerator?.[type]?.({
      chart: useChartStore.getState()[chartId],
      chartId,
      seriesById,
      filteredConfig,
      tooltipCallback: tooltipCb,
      layout,
    });
  }, [type, chartId, layout, seriesById, filteredConfig, tooltipCb]);

  return {
    options,
    series: computedSeries,
    type,
  };
}
