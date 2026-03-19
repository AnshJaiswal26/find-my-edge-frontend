import { formatValue } from "@shared/utils";
import { useChartStore } from "../store";
import { CHART_TYPE } from "../model/enums";

export const groupedTooltipCallback = ({ seriesIndex, chartId }) => {
  const chart = useChartStore.getState().charts[chartId];
  const { layout, type: chartType, seriesOrder, seriesById } = chart;

  const sId = seriesOrder[seriesIndex];

  const { label, color, value, type, format, decimals } = seriesById[sId] || {};

  const display =
    chartType === CHART_TYPE.DONUT
      ? { format: layout.format, decimals: layout.decimals }
      : { format, decimals };

  return {
    dataArray: [
      {
        value: formatValue(value, type || "number", display),
        label: label || "",
        color: color || "var(--info)",
      },
    ],
  };
};
