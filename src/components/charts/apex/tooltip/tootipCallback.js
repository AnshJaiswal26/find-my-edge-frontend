import { useChartStore } from "@charts/apex/store/useChartStore";

const getLegendIndex = (index, fallback) => (index !== null ? index : fallback);

const formatValue = (prefix = "", value, suffix = "") =>
  `${prefix}${value}${suffix}`;

export const tooltipCallback = (
  seriesValue,
  index,
  seriesIndex,
  chartId,
  selectedSeriesKeys,
) => {
  const { [chartId]: chart } = useChartStore.getState();

  const { series, meta, seriesConfig, layout } = chart;

  switch (meta.type) {
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
  }
};
