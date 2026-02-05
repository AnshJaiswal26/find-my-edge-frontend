import { formatValue } from "@utils";
import { useChartStore } from "../store/useChartStore";

export const groupedTooltipCallback = ({
  seriesIndex,
  chartId,
  filteredConfig, // ✅ now source of truth
  series, // ✅ computedSeries from chart
  groups,
}) => {
  const chart = useChartStore.getState()[chartId];
  const { layout } = chart;

  // safety
  if (!filteredConfig?.length || !series?.length) return null;

  const config = groups ? groups[seriesIndex] : filteredConfig[seriesIndex];
  if (!config) return null;

  const value = series[seriesIndex];

  if (chart.meta.type === "donut") {
    console.log(config);
    return {
      dataArray: [
        {
          value: formatValue(value, config?.type || "number", {
            format: layout.format,
            decimals: layout.decimals,
          }),
          label: config?.tooltipLabel || config.label,
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
        label: config?.tooltipLabel || config.label,
        color: config?.color || "var(--info)",
      },
    ],
  };
};
