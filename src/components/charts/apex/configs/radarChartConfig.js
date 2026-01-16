import { customTooltip, parseColor, shadeColor } from "@utils";

export const getRadarChartConfig = ({
  chartId,
  chart,
  tooltipCallback,
  selectedLegendIndex,
}) => {
  const config = chart.layout;
  const index = selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.seriesConfig[index]] : chart.seriesConfig;

  return {
    chart: {
      id: chartId,
      // offsetY: 20,
    },

    labels: chart.series.filtered.map((d) => d.axis),
    colors: seriesConfig.map((s) => s.color),

    tooltip: {
      enabled: config.tooltip,
      custom: customTooltip(tooltipCallback),
    },

    dataLabels: {
      enabled: config.dataLabels,
      formatter: (val, { seriesIndex }) => {
        return (
          seriesConfig[seriesIndex].prefix +
          val +
          seriesConfig[seriesIndex].suffix
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
