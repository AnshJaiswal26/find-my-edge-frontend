import { useCallback, useMemo } from "react";
import { useChartStore } from "@stores";
import { configGenerator } from "../configs";

const seriesGenerator = {
  bar: (chart) => {
    const index = chart.runtime.selectedLegendIndex;
    const cfg =
      index !== null
        ? chart.live.seriesConfig.filter((_, i) => i === index)
        : chart.live.seriesConfig;

    return cfg.map((s) => ({
      name: s.name,
      data: chart.series.filtered.map((d) => d?.[s.key]),
      color: ({ value }) =>
        s.colors.reduce((a, r) => {
          r.from <= value && value <= r.to && (a = r.color);
          return a;
        }, "var(--color-default)"),
    }));
  },

  line: (chart) => {
    const index = chart.runtime.selectedLegendIndex;
    const cfg =
      index !== null
        ? chart.live.seriesConfig.filter((_, i) => i === index)
        : chart.live.seriesConfig;

    return cfg.map((s) => ({
      name: s.name,
      data: chart.series.filtered.map((d) => d?.[s.key]),
      color: s.color,
    }));
  },

  radialBar: (chart) => {
    const index = chart.runtime.selectedLegendIndex;

    if (index !== null) {
      return [chart.series.filtered[index][chart.live.seriesConfig[index].key]];
    }

    return chart.live.seriesConfig.map(
      (s, i) => chart.series.filtered[i][s.key]
    );
  },
};

export default function useChartCfgGenerator({ chartId, type }) {
  const layout = useChartStore((s) => s[chartId].live.layout);
  const filteredSeries = useChartStore((s) => s[chartId].series.filtered);
  const seriesConfig = useChartStore((s) => s[chartId].live.seriesConfig);
  const selectedLegendIndex = useChartStore(
    (s) => s[chartId].runtime.selectedLegendIndex
  );

  // --- Tooltip callback ---
  const tooltipCallback = useCallback((seriesValue, index, seriesIndex) => {
    const { series, meta, live, runtime } = useChartStore.getState()[chartId];

    if (type === "bar") {
      return {
        title: series.filtered?.[index]?.[meta.xaxisMetric],
        dataArray: seriesValue?.map((value, i) => {
          const legendIndex =
            runtime.selectedLegendIndex !== null
              ? runtime.selectedLegendIndex
              : i;

          const { color, label } = live.seriesConfig[legendIndex].colors.reduce(
            (a, r) => {
              if (r.from <= value && value <= r.to) {
                a.color = r.color;
                a.label = r.label;
              }
              return a;
            },
            {}
          );
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
        title: series.filtered[legendIndex][meta.xaxisMetric],
        dataArray: [
          {
            value:
              series.filtered[legendIndex][live.seriesConfig[legendIndex].key],
            label: live.seriesConfig[legendIndex].name,
            color: live.seriesConfig[legendIndex].color,
          },
        ],
      };
    }

    // line / area tooltip
    return {
      title: series.filtered[index][meta.xaxisMetric],
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
  }, []);

  const { options, computedSeries } = useMemo(
    () => ({
      options: configGenerator?.[type]({
        chart: useChartStore.getState()[chartId],
        chartId,
        tooltipCallback,
      }),
      computedSeries: seriesGenerator[type](useChartStore.getState()[chartId]),
    }),
    [layout, seriesConfig, filteredSeries, selectedLegendIndex]
  );

  return {
    options,
    computedSeries,
    seriesConfig,
    layout,
    selectedLegendIndex,
  };
}
