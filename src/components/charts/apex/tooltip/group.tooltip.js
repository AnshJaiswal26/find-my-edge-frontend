import { formatValue } from "@utils";
import { useChartStore } from "../store/useChartStore";

export const groupedTooltipCallback = ({
  seriesIndex,
  chartId,
  filteredConfig, // ✅ now source of truth
  series, // ✅ computedSeries from chart
}) => {
  const chart = useChartStore.getState().charts[chartId];
  const { layout } = chart;

  // safety
  if (!filteredConfig?.length || !series?.length) return null;

  const config = filteredConfig[seriesIndex];
  if (!config) return null;

  const value = series[seriesIndex];

  if (chart.meta.type === "donut") {
    return {
      dataArray: [
        {
          value: formatValue(value, config?.type || "number", {
            format: layout.format,
            decimals: layout.decimals,
          }),
          label: config?.label || config.label,
          color: config?.color || "var(--info)",
        },
      ],
    };
  }

  return {
    dataArray: [
      {
        value: formatValue(value, config?.type || "number", {
          format: config.format,
          decimals: config.decimals,
        }),
        label: config?.label || config.label,
        color: config?.color || "var(--info)",
      },
    ],
  };
};
