import { formatValue } from "@shared/utils";
import { useChartStore } from "../store";

export const groupedTooltipCallback = ({
  seriesIndex,
  chartId,
  filteredSeries,
  dataSeries,
}) => {
  const chart = useChartStore.getState().charts[chartId];
  const { layout, type } = chart;

  // safety
  if (!filteredSeries?.length || !dataSeries?.length) return null;

  const config = filteredSeries[seriesIndex];
  if (!config) return null;

  const value = dataSeries[seriesIndex];

  const display =
    type === "donut"
      ? { format: layout.format, decimals: layout.decimals }
      : { format: config.format, decimals: config.decimals };

  return {
    dataArray: [
      {
        value: formatValue(value, config?.type || "number", display),
        label: config?.label || "",
        color: config?.color || "var(--info)",
      },
    ],
  };
};
