import { useChartStore } from "../store/useChartStore";

const formatValue = (prefix = "", value, suffix = "") =>
  `${prefix}${value}${suffix}`;

const resolveColorRule = (rules, value) =>
  rules?.find((r) => r.from <= value && value <= r.to) ?? {
    color: "var(--info)",
    tooltipLabel: "",
  };

export const seriesTooltipCallback = ({
  seriesValue,
  index,
  chartId,
  getTitle,
  selectedSeriesKeys,
}) => {
  const chart = useChartStore.getState()[chartId];

  const { meta, xSeriesConfig, seriesConfig, layout } = chart;

  return {
    title: getTitle(index, xSeriesConfig.key),
    dataArray: seriesValue.map((value, i) => {
      const config = selectedSeriesKeys
        ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
        : seriesConfig;

      const { color, tooltipLabel } =
        meta.type === "line"
          ? { tooltipLabel: config[i].tooltipLabel, color: config[i].color }
          : resolveColorRule(config[i].colors, value);

      return {
        value: formatValue(layout.yLabelPrefix, value, layout.yLabelSuffix),
        label: tooltipLabel,
        color,
      };
    }),
  };
};
