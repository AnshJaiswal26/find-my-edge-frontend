import { useChartStore } from "@stores";

const getLegendIndex = (runtime, fallback) =>
  runtime.selectedLegendIndex !== null ? runtime.selectedLegendIndex : fallback;

const formatValue = (prefix = "", value, suffix = "") =>
  `${prefix}${value}${suffix}`;

const resolveColorRule = (rules, value) =>
  rules?.find((r) => r.from <= value && value <= r.to) ?? {
    color: "var(--info)",
    tooltipLabel: "",
  };

export const tooltipCallback = (
  seriesValue,
  index,
  seriesIndex,
  type,
  chartId
) => {
  const chart = useChartStore.getState()[chartId];
  const { series, meta, seriesConfig, layout, runtime } = chart;

  switch (type) {
    /* ---------------- BAR ---------------- */
    case "bar": {
      return {
        title: series.filtered?.[index]?.[meta.xaxisMetric],
        dataArray: seriesValue.map((value, i) => {
          const legendIndex = getLegendIndex(runtime, i);
          const config = seriesConfig[legendIndex];

          const rule = resolveColorRule(config.colors, value);

          return {
            value: formatValue(layout.yLabelPrefix, value, layout.yLabelSuffix),
            label: rule.tooltipLabel,
            color: rule.color,
          };
        }),
      };
    }

    /* ---------------- RADIAL / DONUT ---------------- */
    case "radialBar":
    case "donut": {
      const legendIndex = getLegendIndex(runtime, seriesIndex);
      const config = seriesConfig[legendIndex];

      return {
        dataArray: [
          {
            value: formatValue(
              layout.valuePrefix,
              series.filtered[legendIndex],
              layout.valueSuffix
            ),
            label: config.tooltipLabel,
            color: config.color,
          },
        ],
      };
    }

    /* ---------------- RADAR ---------------- */
    case "radar": {
      const legendIndex = getLegendIndex(runtime, seriesIndex);
      const config = seriesConfig[legendIndex];

      return {
        title: series.filtered[index]?.axis,
        dataArray: [
          {
            value: formatValue(
              config.prefix,
              series.filtered[index][config.key],
              config.suffix
            ),
            label: config.tooltipLabel,
            color: config.color,
          },
        ],
      };
    }

    /* ---------------- POLAR AREA ---------------- */
    case "polarArea": {
      const legendIndex = getLegendIndex(runtime, seriesIndex);
      const config = seriesConfig[legendIndex];

      return {
        title: series.filtered[legendIndex]?.axis,
        dataArray: [
          {
            value: formatValue(
              config.prefix,
              series.filtered[legendIndex][config.key],
              config.suffix
            ),
            label: config.tooltipLabel,
            color: config.color,
          },
        ],
      };
    }

    /* ---------------- LINE / AREA (DEFAULT) ---------------- */
    default: {
      return {
        title: series.filtered?.[index]?.[meta.xaxisMetric],
        dataArray: seriesValue.map((value, i) => {
          const legendIndex = getLegendIndex(runtime, i);
          const config = seriesConfig[legendIndex];

          return {
            value: formatValue(layout.yLabelPrefix, value, layout.yLabelSuffix),
            label: config.tooltipLabel,
            color: config.color,
          };
        }),
      };
    }
  }
};
