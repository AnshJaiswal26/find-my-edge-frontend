import { useMemo } from "react";
import { useChartAxes } from "./useChartAxes";
import { useChartDataLabels } from "./useChartDataLabels";
import { useChartEvents } from "./useChartEvents";
import { useChartGrid } from "./useChartGrid";
import { useChartTooltip } from "./useChartTooltip";

export const useCartesianChartConfig = ({
  ids,
  type,
  chartId,
  layout,
  seriesSelector,
  tooltipCallback,
  series,
  mode,
  xMetric,
  groupSelector,
}) => {
  const events = useChartEvents(chartId, layout);
  const { xaxis, yaxis } = useChartAxes({
    ids,
    seriesSelector,
    layout,
    series,
    mode,
    xMetric,
    groupSelector,
  });
  const grid = useChartGrid(layout);
  const tooltip = useChartTooltip(layout, tooltipCallback);
  const dataLabels = useChartDataLabels(type, layout);

  return useMemo(
    () => ({
      chart: {
        id: chartId,
        fontFamily: "inherit",
        toolbar: { show: true, tools: { download: true, selection: false } },
        zoom: { enabled: false },
        selection: { enabled: false },
        events,
      },
      grid,
      tooltip,
      dataLabels,
      xaxis,
      yaxis,
      legend: { show: false },
    }),
    [chartId, events, grid, tooltip, dataLabels, xaxis, yaxis],
  );
};
