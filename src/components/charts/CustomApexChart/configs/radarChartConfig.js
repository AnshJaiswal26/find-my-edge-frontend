import { customTooltip } from "@utils";

export const getRadarChartConfig = ({ chartId, chart, tooltipCallback }) => {
  const config = chart.live.layout;
  const index = chart.runtime.selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.live.seriesConfig[index]] : chart.live.seriesConfig;

  return {
    chart: {
      id: chartId,
    },

    labels: chart.series.filtered.map((d) => d.axis),
    colors: seriesConfig.map((s) => s.color),

    tooltip: {
      enabled: config.tooltip,
      custom: customTooltip(tooltipCallback),
    },

    dataLabels: {
      enabled: config.showEdgeLabels,
      formatter: (val) => config.edgeValuePrefix + val + config.edgeValueSuffix,
    },

    markers: {
      size: 8,
      strokeWidth: 2,
      hover: { size: 10 },
    },

    stroke: {
      width: 2,
    },

    fill: {
      opacity: 0.1,
    },

    plotOptions: {
      radar: {
        polygons: {
          strokeColors: config.polygonStroke,
          strokeWidth: config.polygonStrokeWidth,
          connectorColors: config.polygonStroke,
          fill: {
            colors: [config.polygonFill],
          },
        },
      },
    },

    xaxis: {
      show: config.showAxisLabels,
      categories: chart.series.filtered.map((d) => d.axis),
      labels: {
        formatter: (val) =>
          config.axisLabelPrefix + val + config.axisLabelSuffix,
      },
    },
    legend: {
      show: false,
    },
  };
};
