import { useChartStore } from "@charts/apex/store/useChartStore";

const getLegendIndex = (index, fallback) => (index !== null ? index : fallback);

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
  chartId,
  order,
  selectedSeriesKeys,
) => {
  const { [chartId]: chart, seriesById } = useChartStore.getState();

  const { series, meta, seriesConfig, layout } = chart;

  switch (meta.type) {
    /* ---------------- RADIAL / DONUT ---------------- */
    case "radialBar":
    case "donut": {
      // 1️⃣ decide active series key
      const activeKey =
        selectedSeriesKeys?.length === 1
          ? selectedSeriesKeys[0]
          : seriesConfig[seriesIndex]?.key;

      // 2️⃣ find config
      const config = seriesConfig.find((s) => s.key === activeKey);

      // 3️⃣ find value index
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
    }

    /* ---------------- RADAR ---------------- */
    case "radar": {
      const legendIndex = getLegendIndex(selectedSeriesKeys, seriesIndex);
      const config = seriesConfig[legendIndex];

      return {
        title: series.filtered[index]?.axis,
        dataArray: [
          {
            value: formatValue(
              config.prefix,
              series.filtered[index][config.key],
              config.suffix,
            ),
            label: config.tooltipLabel,
            color: config.color,
          },
        ],
      };
    }

    /* ---------------- POLAR AREA ---------------- */
    case "polarArea": {
      const legendIndex = getLegendIndex(selectedSeriesKeys, seriesIndex);
      const config = seriesConfig[legendIndex];

      return {
        title: series.filtered[legendIndex]?.axis,
        dataArray: [
          {
            value: formatValue(
              config.prefix,
              series.filtered[legendIndex][config.key],
              config.suffix,
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
          const config = selectedSeriesKeys
            ? seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
            : seriesConfig;

          const { color, tooltipLabel } =
            meta.type === "line"
              ? { tooltipLabel: config[i].tooltipLabel, color: config[i].color }
              : resolveColorRule(config[i].colors, value);

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
