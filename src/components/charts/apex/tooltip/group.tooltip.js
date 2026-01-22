import { useChartStore } from "../store/useChartStore";

const formatValue = (prefix = "", value, suffix = "") =>
  `${prefix}${value}${suffix}`;

export const groupedChartTooltipCallback = ({
  seriesIndex,
  chartId,
  selectedSeriesKeys,
}) => {
  const chart = useChartStore.getState()[chartId];

  const { series, seriesConfig, layout } = chart;

  //  decide active series key
  const activeKey =
    selectedSeriesKeys?.length === 1
      ? selectedSeriesKeys[0]
      : seriesConfig[seriesIndex]?.key;

  // find config
  const config = seriesConfig.find((s) => s.key === activeKey);

  // find value index
  const valueIndex = seriesConfig.findIndex((s) => s.key === activeKey);

  // safety guard
  if (!config || valueIndex === -1) return null;

  return {
    dataArray: [
      {
        value: formatValue(
          layout.valuePrefix,
          series[valueIndex],
          layout.valueSuffix,
        ),
        label: config.tooltipLabel,
        color: config.color,
      },
    ],
  };
};
