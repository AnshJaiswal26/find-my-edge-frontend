import { formatValue } from "@utils";
import { useChartStore } from "../store/useChartStore";

export const groupedTooltipCallback = ({
  seriesIndex,
  chartId,
  filteredConfig, // ✅ now source of truth
  series, // ✅ computedSeries from chart
}) => {
  const chart = useChartStore.getState()[chartId];
  const { layout } = chart;

  // safety
  if (!filteredConfig?.length || !series?.length) return null;

  const config = filteredConfig[seriesIndex];
  if (!config) return null;

  const value = series[seriesIndex];

  return {
    dataArray: [
      {
        value: formatValue(value, config.type, {
          format: layout.format,
          decimals: layout.decimals,
        }),
        label: config.tooltipLabel,
        color: config.color,
      },
    ],
  };
};
