import {
  evaluateColorRules,
  formatGroupValue,
  formatValue,
} from "@shared/utils";
import { useChartStore } from "../store";

function getActiveSeriesConfig(series, selectedSeriesKeys) {
  if (!selectedSeriesKeys?.length) return series;

  return series.filter((s) => selectedSeriesKeys.includes(s.key));
}

function formatTooltipTitle(title, xMetric, layout, mode) {
  const options = {
    format: layout.xFormat,
    decimals: layout.xDecimals,
  };

  return mode === "GROUP_AGGREGATE"
    ? formatGroupValue(title, xMetric.type, options)
    : formatValue(title, xMetric.type, options);
}

function resolveSeriesStyle({ value, config, chartType }) {
  if (chartType === "line") {
    return {
      color: config.color,
      label: config.label || "",
    };
  }

  if (config.colorRules?.length) {
    return evaluateColorRules(value, config.colorRules);
  }

  return {
    color: "var(--info)",
    label: config.label || "",
  };
}

function buildTooltipRow(value, config, layout, chartType) {
  const style = resolveSeriesStyle({
    value,
    config,
    chartType,
  });

  return {
    value: formatValue(value, config.type, {
      format: layout.yFormat,
      decimals: layout.yDecimals,
    }),
    label: style.label || "",
    color: style.color || "var(--info)",
  };
}

export const seriesTooltipCallback = ({
  seriesValue,
  index,
  chartId,
  getTitle,
  selectedSeriesKeys,
}) => {
  const chart = useChartStore.getState().charts[chartId];

  const { type, xMetric, series, layout, mode } = chart;

  const activeSeriesConfig = getActiveSeriesConfig(series, selectedSeriesKeys);

  const titleValue = getTitle(xMetric.field);

  const title = formatTooltipTitle(titleValue, xMetric, layout, mode);

  const dataArray = seriesValue.map((value, i) =>
    buildTooltipRow(value, activeSeriesConfig[i], layout, type),
  );

  return {
    title,
    dataArray,
  };
};
