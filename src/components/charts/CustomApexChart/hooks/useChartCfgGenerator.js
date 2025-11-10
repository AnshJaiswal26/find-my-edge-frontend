import { useEffect, useMemo } from "react";
import { useChartStore } from "@stores";
import { configGenerator } from "../configs";
import ApexCharts from "apexcharts";

const seriesGenerator = {
  bar: (chart) => {
    const index = chart.selectedLegendIndex;
    const cfg =
      index !== null
        ? [chart.live.seriesConfig[index]]
        : chart.live.seriesConfig;

    return cfg.map((s) => ({
      name: s.name,
      data: chart.series.map((d) => d?.[s.key]),
      color: ({ value }) =>
        s.colors.filter((r) => value >= r.from && value <= r.to)[0]?.color ||
        "var(--color-default)",
    }));
  },

  line: (chart) => {
    const index = chart.selectedLegendIndex;
    const cfg =
      index !== null
        ? [chart.live.seriesConfig[index]]
        : chart.live.seriesConfig;

    return cfg.map((s) => ({
      name: s.name,
      data: chart.series.map((d) => d?.[s.key]),
      color: s.color,
    }));
  },

  donut: (chart) => {
    const index = chart.selectedLegendIndex;

    if (index !== null) {
      return [chart.series[index]];
    }

    return chart.live.seriesConfig.map((s, i) => chart.series[i]);
  },

  radialBar: (chart) => {
    const index = chart.selectedLegendIndex;

    if (index !== null) {
      return [chart.series[index]];
    }

    return chart.live.seriesConfig.map((s, i) => chart.series[i]);
  },

  radar: (chart) => {
    const index = chart.selectedLegendIndex;

    const getSeriesValues = (s) =>
      chart.series.map((d) => Number(d[s.key] ?? 0));

    if (index !== null) {
      const s = chart.live.seriesConfig[index];
      return [
        {
          name: s.name,
          data: getSeriesValues(s),
          color: s.color,
        },
      ];
    }

    return chart.live.seriesConfig.map((s) => ({
      name: s.name,
      data: getSeriesValues(s),
      color: s.color,
    }));
  },
};

export default function useChartCfgGenerator({ chartId, type }) {
  const live = useChartStore((s) => s[chartId].live);
  const layout = live.layout;
  const seriesConfig = live.seriesConfig;

  const filteredSeries = useChartStore((s) => s[chartId].series.filtered);
  const selectedLegendIndex = useChartStore(
    (s) => s[chartId].runtime.selectedLegendIndex
  );

  // --- Tooltip callback ---
  const tooltipCallback = (seriesValue, index, seriesIndex) => {
    const { series, meta, live, runtime } = useChartStore.getState()[chartId];

    if (type === "bar") {
      return {
        title: series.filtered?.[index]?.[meta.xaxisMetric],
        dataArray: seriesValue?.map((value, i) => {
          const legendIndex =
            runtime.selectedLegendIndex !== null
              ? runtime.selectedLegendIndex
              : i;

          const { color, label } = live.seriesConfig[legendIndex].colors.filter(
            (r) => r.from <= value && value <= r.to
          )[0] || { color: "var(--color-default)", label: "" };

          return {
            value: live.layout.yLabelPrefix + value + live.layout.yLabelSuffix,
            label,
            color,
          };
        }),
      };
    } else if (type === "radialBar") {
      const legendIndex =
        runtime.selectedLegendIndex !== null
          ? runtime.selectedLegendIndex
          : seriesIndex;
      return {
        // title: live.seriesConfig[legendIndex].name,

        dataArray: [
          {
            value:
              live.layout.valuePrefix +
              series.filtered[legendIndex] +
              live.layout.valueSuffix,
            label: live.seriesConfig[legendIndex].name,
            color: live.seriesConfig[legendIndex].color,
            // indicator: false,
          },
        ],
      };
    } else if (type === "donut") {
      const legendIndex =
        runtime.selectedLegendIndex !== null
          ? runtime.selectedLegendIndex
          : seriesIndex;
      return {
        dataArray: [
          {
            value:
              live.layout.valuePrefix +
              series.filtered[legendIndex] +
              live.layout.valueSuffix,
            label: live.seriesConfig[legendIndex].name,
            color: live.seriesConfig[legendIndex].color,
            // indicator: false,
          },
        ],
      };
    } else if (type === "radar") {
      const legendIndex =
        runtime.selectedLegendIndex !== null
          ? runtime.selectedLegendIndex
          : seriesIndex;
      return {
        title: series.filtered[index].axis,

        dataArray: [
          {
            value:
              live.seriesConfig[legendIndex].prefix +
              series.filtered[index][live.seriesConfig[legendIndex].key] +
              live.seriesConfig[legendIndex].suffix,
            label: live.seriesConfig[legendIndex].name,
            color: live.seriesConfig[legendIndex].color,
          },
        ],
      };
    }

    // line / area tooltip
    return {
      title: series.filtered[index]?.[meta.xaxisMetric],
      dataArray: seriesValue.map((value, i) => {
        const legendIndex =
          runtime.selectedLegendIndex !== null
            ? runtime.selectedLegendIndex
            : i;

        return {
          value: layout.yLabelPrefix + value + layout.yLabelSuffix,
          label: live.seriesConfig[legendIndex].name,
          color: live.seriesConfig[legendIndex].color,
        };
      }),
    };
  };

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        tooltipCallback,
      }),
      computedSeries: seriesGenerator[type]({
        live,
        series: filteredSeries,
        selectedLegendIndex,
      }),
    }),
    [live, filteredSeries, selectedLegendIndex]
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
  }, [selectedLegendIndex]);

  return {
    options,
    computedSeries,
    seriesConfig,
    layout,
    selectedLegendIndex,
  };
}
