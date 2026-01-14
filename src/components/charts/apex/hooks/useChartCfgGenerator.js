import { useEffect, useMemo } from "react";
import { useChartStore } from "@stores";
import { configGenerator } from "../configs";
import ApexCharts from "apexcharts";
import { tooltipCallback } from "../tooltip/tootipCallback";

const getCircularChartSeries = (chart) => {
  const index = chart.selectedLegendIndex;
  return index !== null ? [chart.series[index]] : chart.series;
};

const seriesGenerator = {
  bar: (chart) => {
    const index = chart.selectedLegendIndex;
    const cfg =
      index !== null ? [chart.seriesConfig[index]] : chart.seriesConfig;

    return cfg.map((s) => ({
      name: s.name,
      data: chart.series.map((d) => d?.[s.key]),
      color: ({ value }) =>
        s.colors.filter((r) => value >= r.from && value <= r.to)[0]?.color ||
        "var(--info)",
    }));
  },

  line: (chart) => {
    const index = chart.selectedLegendIndex;
    const cfg =
      index !== null ? [chart.seriesConfig[index]] : chart.seriesConfig;

    return cfg.map((s) => ({
      name: s.name,
      data: chart.series.map((d) => d?.[s.key]),
      color: s.color,
    }));
  },

  donut: getCircularChartSeries,

  radialBar: getCircularChartSeries,

  radar: (chart) => {
    const index = chart.selectedLegendIndex;

    const getSeriesValues = (s) =>
      chart.series.map((d) => Number(d[s.key] ?? 0));

    if (index !== null) {
      const s = chart.seriesConfig[index];
      return [
        {
          name: s.name,
          data: getSeriesValues(s),
          color: s.color,
        },
      ];
    }

    return chart.seriesConfig.map((s) => ({
      name: s.name,
      data: getSeriesValues(s),
      color: s.color,
    }));
  },

  polarArea: (chart) => {
    const index = chart.selectedLegendIndex;

    if (index !== null) {
      const s = chart.seriesConfig[index];
      return [chart.series[index][s.key]];
    }

    return chart.series.map((s) => s.data);
  },
};

export default function useChartCfgGenerator({ chartId, type }) {
  const layout = useChartStore((s) => s[chartId].layout);
  const seriesConfig = useChartStore((s) => s[chartId].seriesConfig);

  const filteredSeries = useChartStore((s) => s[chartId].series.filtered);
  const selectedLegendIndex = useChartStore(
    (s) => s[chartId].runtime.selectedLegendIndex
  );

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        tooltipCallback: (seriesValue, index, seriesIndex) =>
          tooltipCallback(seriesValue, index, seriesIndex, type, chartId),
      }),
      computedSeries: seriesGenerator[type]({
        seriesConfig,
        layout,
        series: filteredSeries,
        selectedLegendIndex,
      }),
    }),
    [seriesConfig, layout, , filteredSeries, selectedLegendIndex]
  );

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
  }, [seriesConfig, layout, filteredSeries, selectedLegendIndex]);

  return {
    options,
    computedSeries,
    seriesConfig,
    layout,
    selectedLegendIndex,
  };
}
