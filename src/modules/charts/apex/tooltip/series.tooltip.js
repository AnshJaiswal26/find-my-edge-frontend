import { evaluateColorRules } from "@shared/utils";
import { useChartStore } from "../store";

function resolveSeriesStyle({ value, config }) {
  if (config?.colorRules?.length) {
    return evaluateColorRules(value, config.colorRules);
  }

  if (!config?.colorRules) {
    return {
      color: config.color,
      label: config.label || "",
    };
  }

  return {
    color: "var(--info)",
    label: config.label || "",
  };
}

function buildTooltipRow(value, config, formatter) {
  const style = resolveSeriesStyle({ value, config });

  return {
    value: formatter(value),
    label: style.label || "",
    color: style.color || "var(--info)",
  };
}

export const seriesTooltipCallback = ({
  seriesValue,
  seriesIndex,
  index,
  w,
  chartId,
}) => {
  const chart = useChartStore.getState().charts[chartId];

  const nonActiveIndexes = w.globals.collapsedSeriesIndices || [];

  const value = seriesValue[seriesIndex];

  const formatter = w.globals.yLabelFormatters[0];

  const dataArray = nonActiveIndexes.length
    ? [buildTooltipRow(value, chart.series[seriesIndex], formatter)]
    : chart.series.map((_, i) =>
        buildTooltipRow(value, chart.series[i], formatter),
      );

  return {
    title: w.globals.categoryLabels[index],
    dataArray,
  };
};
