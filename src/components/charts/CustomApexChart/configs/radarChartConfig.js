import { customTooltip } from "@utils";

export const getRadarChartConfig = ({ chartId, chart, tooltipCallback }) => {
  const config = chart.live.layout;
  const index = chart.runtime.selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.live.seriesConfig[index]] : chart.live.seriesConfig;

  return {
    chart: {
      id: chartId,
      offsetY: 20,
    },

    labels: chart.series.filtered.map((d) => d.axis),
    colors: seriesConfig.map((s) => s.color),

    tooltip: {
      enabled: config.tooltip,
      custom: customTooltip(tooltipCallback),
    },

    dataLabels: {
      enabled: config.showEdgeLabels,
      formatter: (val, rer) => {
        return (
          seriesConfig[rer.seriesIndex].prefix +
          val +
          seriesConfig[rer.seriesIndex].suffix
        );
      },
    },

    markers: {
      size: config.markerSize,
      strokeWidth: 0,
      hover: { size: config.markerHoverSize },
    },

    stroke: {
      width: 1,
    },

    fill: {
      opacity: config.radarOpacity,
    },

    plotOptions: {
      radar: {
        size: config.radarSize,
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
      labels: {
        show: config.showXAxisLabels,
      },
    },
    yaxis: {
      show: config.showYAxisLabels,
    },
    legend: {
      show: false,
    },
  };
};
