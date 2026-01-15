import { useChartStore } from "@charts/apex/store/useChartStore";

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
  const {
    [chartId]: chart,
    seriesById,
    seriesOrder,
  } = useChartStore.getState();

  const {
    series,
    meta,
    seriesConfig,
    layout,
    runtime,
    sortedOrder,
    filteredOrder,
  } = chart;

  const order = sortedOrder.length
    ? sortedOrder
    : filteredOrder.length
    ? filteredOrder
    : seriesOrder;

  switch (type) {
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

    /* ---------------- BAR / LINE / AREA (DEFAULT) ---------------- */
    default: {
      return {
        title: seriesById?.[order[index]]?.[meta.xaxisMetric],
        dataArray: seriesValue.map((value, i) => {
          const legendIndex = getLegendIndex(runtime, i);
          const config = seriesConfig[legendIndex];

          const { color, tooltipLabel } =
            type === "line"
              ? { tooltipLabel: config.tooltipLabel, color: config.color }
              : resolveColorRule(config.colors, value);

          return {
            value: formatValue(layout.yLabelPrefix, value, layout.yLabelSuffix),
            label: tooltipLabel,
            color,
          };
        }),
      };
    }
  }
};
