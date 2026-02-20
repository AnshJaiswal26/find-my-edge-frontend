import { useMemo } from "react";
import { configGenerator } from "../configs";
import { useChartStore } from "../store/useChartStore";
import { formatValue } from "@utils";

const data = [
  { axis: "Nifty 50", data: [3.3, 1.3, 2.1] },
  { axis: "Bank Nifty", data: [2.2, 0.8, 1.4] },
  { axis: "Sensex", data: [1.1, 0.5, 0.8] },
];

const radarSeriesGenerator = ({ seriesOrder, seriesById, seriesConfig }) => {
  return seriesConfig.map((s, i) => ({
    ...data[i],
    color: s.color,
  }));
};

const tooltipCallback = ({
  index,
  seriesValue,
  seriesIndex,
  series,
  chartId,
  filteredConfig,
}) => {
  // const { layout } = useChartStore.getState().charts[chartId];
  const config = filteredConfig;
  // console.log({ seriesIndex, seriesValue, index });

  return {
    title: series[seriesIndex]?.axis,
    dataArray: [
      {
        value: seriesValue[seriesIndex],
        label: config[seriesIndex].label,
        color: config[seriesIndex].color,
      },
    ],
  };
};

export default function useRadarChartConfig({
  chartId,
  layout,
  seriesOrder,
  seriesById,
  seriesConfig,
  selectedSeriesKeys,
}) {
  const type = "radar";

  const filteredConfig = selectedSeriesKeys
    ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
    : seriesConfig;

  const series = useMemo(
    () =>
      radarSeriesGenerator({
        seriesOrder,
        seriesById,
        seriesConfig: filteredConfig,
      }),
    [seriesOrder, seriesById, filteredConfig],
  );

  const categories = useMemo(
    () => filteredConfig.map((s) => s.name),
    [filteredConfig],
  );

  const options = useMemo(
    () =>
      configGenerator?.radar?.({
        chart: useChartStore.getState().charts[chartId],
        chartId,
        categories,
        layout,
        series,
        filteredConfig,
        tooltipCallback: (seriesValue, index, seriesIndex) =>
          tooltipCallback({
            seriesValue,
            index,
            seriesIndex,
            chartId,
            filteredConfig,
            series,
          }),
      }),
    [chartId, categories, layout, filteredConfig],
  );

  return { type, series, options };
}
