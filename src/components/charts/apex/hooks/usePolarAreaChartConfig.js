import { useMemo } from "react";

const polarSeriesGenerator = ({ seriesConfig, seriesOrder, seriesById }) => {
  return seriesConfig.map((s) => {
    let total = 0;

    seriesOrder.forEach((id) => {
      total += Number(seriesById[id]?.[s.key] ?? 0);
    });

    return total;
  });
};

export default function usePolarAreaChartConfig({
  chartId,
  layout,
  seriesConfig,
  seriesOrder,
  seriesById,
  selectedSeriesKeys,
}) {
  const type = "polarArea";

  const filteredConfig = selectedSeriesKeys
    ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
    : seriesConfig;

  const series = useMemo(
    () =>
      polarSeriesGenerator({
        seriesConfig: filteredConfig,
        seriesOrder,
        seriesById,
      }),
    [filteredConfig, seriesOrder, seriesById],
  );

  const labels = useMemo(
    () => filteredConfig.map((s) => s.name),
    [filteredConfig],
  );

  const options = useMemo(
    () =>
      configGenerator?.polarArea?.({
        chart: useChartStore.getState()[chartId],
        chartId,
        labels,
        layout,
      }),
    [chartId, labels, layout],
  );

  return { type, series, options };
}
