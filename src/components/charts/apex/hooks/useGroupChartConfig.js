import { useCallback, useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";
import { RATIO_FUNCTIONS } from "@lib/analytics/engine/functions/ratio";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";

const getSeries = ({ seriesConfig, seriesById, seriesOrder, groups }) => {
  if (groups) {
    const series = [];
    const s = seriesConfig[0];
    console.log(groups);
    for (const group of groups) {
      const reducer =
        RATIO_FUNCTIONS[s.reducer]?.reducer ??
        WINDOW_FUNCTIONS[s.reducer].reducer;

      console.log(series, reducer);

      const state = reducer.init(seriesOrder.length);

      group.tradeIds.forEach((id) => {
        reducer.step(state, { pnl: seriesById[id].pnl });
      });

      const result = reducer.result(state);

      series.push(result);
    }
    console.log(series);
    return series;
  }

  const series = seriesConfig.map((s) => {
    const reducer =
      RATIO_FUNCTIONS[s.reducer]?.reducer ??
      WINDOW_FUNCTIONS[s.reducer].reducer;

    const state = reducer.init(seriesOrder.length);

    seriesOrder.forEach((id) => {
      reducer.step(state, { pnl: seriesById[id].pnl });
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
  groups,
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
      groups,
    });
  }, [type, filteredConfig, seriesOrder, seriesById, groups]);

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
        groups,
      }),
    [chartId, selectedSeriesKeys, groups],
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
