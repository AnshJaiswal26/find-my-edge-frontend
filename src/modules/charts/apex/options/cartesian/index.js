import { buildChartAxes } from "./buildChartAxes";
import { buildChartDataLabels } from "./buildChartDataLabels";
import { buildChartEvents } from "./buildChartEvents";
import { buildChartGrid } from "./buildChartGrid";
import { buildChartTooltip } from "./useChartTooltip";

export const buildCartesianChartOptions = ({
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
  const events = buildChartEvents(chartId, layout);
  const { xaxis, yaxis } = buildChartAxes({
    ids,
    seriesSelector,
    layout,
    series,
    mode,
    xMetric,
    groupSelector,
  });
  const grid = buildChartGrid(layout);
  const tooltip = buildChartTooltip(layout, tooltipCallback);
  const dataLabels = buildChartDataLabels(type, layout);

  return {
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
  };
};
