import { customTooltip, parseColor, shadeColor } from "@utils";

export const getPolarChartConfig = ({ chartId, chart, tooltipCallback }) => {
  const config = chart.live.layout;

  const index = chart.runtime.selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.live.seriesConfig[index]] : chart.live.seriesConfig;

  return {
    chart: {
      id: chartId,
    },

    plotOptions: {
      polarArea: {
        rings: {
          strokeColor: "var(--color-border-default)", // ring circles
          strokeWidth: 0,
        },
        spokes: {
          strokeColor: "var(--color-border-default)", // radial lines
          strokeWidth: 1,
        },
      },
    },

    labels: chart.series.filtered.map((d) => d.axis),
    colors: seriesConfig.map((s) => s.color),

    legend: { show: false },

    dataLabels: {
      enabled: config.dataLabels,
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
          shadeColor(parseColor(s.color), 20)
        ),
        inverseColors: false,
        opacityFrom: config.fillOpacity,
        opacityTo: config.fillOpacity / 2,
        stops: [0, 90],
      },
    },

    markers: {
      size: config.markerSize,
      hover: { size: config.markerHoverSize },
    },

    xaxis: {
      labels: { show: config.showCategoryLabels },
    },

    yaxis: {
      labels: { show: config.showValueGrid },
    },
  };
};
