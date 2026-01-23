import { formatValue } from "@utils";
import { useChartStore } from "../store/useChartStore";

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

  const { meta, xSeriesConfig, ySeriesConfig, layout } = chart;

  return {
    title: formatValue(getTitle(index, xSeriesConfig.key), xSeriesConfig.type, {
      format: layout.xFormat,
      decimals: layout.xDecimals,
    }),
    dataArray: seriesValue.map((value, i) => {
      const config = selectedSeriesKeys
        ? ySeriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
        : ySeriesConfig;

      const { color, tooltipLabel } =
        meta.type === "line"
          ? { tooltipLabel: config[i].tooltipLabel, color: config[i].color }
          : resolveColorRule(config[i].colors, value);

      return {
        value: formatValue(value, config[0].type, {
          format: layout.yFormat,
          decimals: layout.yDecimals,
        }),
        label: tooltipLabel,
        color,
      };
    }),
  };
};
