import { useEffect, useMemo } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { configGenerator } from "../configs";
import ApexCharts from "apexcharts";
import { tooltipCallback } from "../tooltip/tootipCallback";

const getCircularChartSeries = ({ selectedSeries }) => {
  const index = chart.selectedLegendIndex;
  return index !== null ? [chart.series[index]] : chart.series;
};

const seriesGenerator = {
  donut: getCircularChartSeries,
  radialBar: getCircularChartSeries,
};

export default function useGroupChartConfig({
  chartId,
  layout,
  seriesConfig,
  selectedSeries,
}) {
  const type = useChartStore((s) => s[chartId].meta.type);

  const seriesById = useChartStore((s) => s.seriesById);

  // const filteredSeries = useChartStore((s) => s[chartId].series.filtered);

  const filteredOrder = useChartStore((s) =>
    s[chartId].sortedOrder.length !== 0
      ? s[chartId].sortedOrder
      : s[chartId].filteredOrder.length !== 0
      ? s[chartId].filteredOrder
      : s.seriesOrder
  );

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        order: filteredOrder,
        seriesById,
        selectedSeries,
        tooltipCallback: (sv, i, si) =>
          tooltipCallback(sv, i, si, chartId, selectedSeries),
      }),
      computedSeries: seriesGenerator[type]({
        seriesConfig,
        filteredOrder,
        seriesById,
        layout,
        // series: filteredSeries,
        selectedLegendIndex,
      }),
    }),
    [
      seriesConfig,
      layout,
      // filteredSeries,
      selectedLegendIndex,
      seriesById,
      filteredOrder,
    ]
  );

  console.log(options, computedSeries);

  useEffect(() => {
    const listener = (e) => {
      if (e.detail?.chartId === chartId) {
        ApexCharts.exec(chartId, "resize");
      }
    };
    window.addEventListener("chart-resize", listener);
    return () => window.removeEventListener("chart-resize", listener);
  }, []);

  useEffect(() => {
    if (type === "radialBar" || type === "donut") {
      ApexCharts.exec(chartId, "updateSeries", computedSeries, true);
    }
  }, [
    seriesConfig,
    layout,
    //  filteredSeries,
    selectedLegendIndex,
  ]);

  return {
    options,
    computedSeries,
    selectedLegendIndex,
    type,
  };
}
