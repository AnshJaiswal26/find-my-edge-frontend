import { formatValue } from "@utils";
import { useChartStore } from "../store/useChartStore";

export const groupedTooltipCallback = ({
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
        value: formatValue(series[valueIndex], config.type, {
          format: layout.format,
          decimals: layout.decimals,
        }),
        label: config.tooltipLabel,
        color: config.color,
      },
    ],
  };
};
