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

  const {
    categoryLabels,
    collapsedSeriesIndices,
    xLabelFormatter,
    yLabelFormatters,
  } = w.globals;

  const isHorizontal = chart.layout.horizontal;

  const formatter = isHorizontal ? xLabelFormatter : yLabelFormatters[0];

  const dataArray = collapsedSeriesIndices.length
    ? [
        buildTooltipRow(
          seriesValue[seriesIndex],
          chart.seriesById[chart.seriesOrder[seriesIndex]],
          formatter,
        ),
      ]
    : chart.seriesOrder.map((sId, i) =>
        buildTooltipRow(seriesValue[i], chart.seriesById[sId], formatter),
      );

  return {
    title: isHorizontal ? yLabelFormatters[0](index) : categoryLabels[index],
    dataArray,
  };
};
