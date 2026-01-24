import { evaluateColorRules, formatValue } from "@utils";
import { useChartStore } from "../store/useChartStore";

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

      const { color, label } =
        meta.type === "line"
          ? { color: config[i].color, label: config[i].label }
          : evaluateColorRules(value, config[i].colorRules);

      return {
        value: formatValue(value, config[0].type, {
          format: layout.yFormat,
          decimals: layout.yDecimals,
        }),
        label,
        color,
      };
    }),
  };
};
