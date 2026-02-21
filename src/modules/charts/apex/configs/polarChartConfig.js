import { customTooltip, parseColor, shadeColor } from "@shared/utils";

export const getPolarChartConfig = ({
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
    },

    plotOptions: {
      polarArea: {
        size: config.polarSize,
        rings: {
          strokeColor: config.ringBorderColor,
          strokeWidth: config.ringBorderWidth,
        },
      },
    },

    labels: chart.series.filtered.map((d) => d.axis),
    colors: seriesConfig.map((s) => s.color),

    legend: { show: false },

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

    tooltip: {
      enabled: config.tooltip,
      custom: customTooltip(tooltipCallback),
    },

    stroke: {
      width: config.strokeWidth,
    },

    fill: {
      opacity: config.fillOpacity,
      type: "gradient",
      gradient: {
        shadeIntensity: 0.6,
        gradientToColors: seriesConfig.map((s) =>
          shadeColor(parseColor(s.color), 20),
        ),
        inverseColors: false,
        opacityFrom: config.fillOpacityFrom,
        opacityTo: config.fillOpacityTo,
        stops: [0, 100],
      },
    },

    yaxis: {
      show: config.showYAxisLabels,
    },
  };
};
