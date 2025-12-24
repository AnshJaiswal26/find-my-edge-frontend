import { customTooltip, parseColor, shadeColor } from "@utils";

export const getPieChartConfig = ({ chartId, chart, tooltipCallback }) => {
  const config = chart.layout;

  const index = chart.runtime.selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.seriesConfig[index]] : chart.seriesConfig;

  return {
    chart: {
      id: chartId,
    },

    labels: seriesConfig.map((s) => s.name),
    colors: seriesConfig.map((s) => s.color),

    legend: { show: false },

    dataLabels: {
      enabled: config.dataLabels,
      formatter: (val, opts) => {
        return config.valuePrefix + val + config.valueSuffix;
      },
    },

    tooltip: {
      enabled: config.tooltip,
      custom: customTooltip(tooltipCallback),
    },

    states: {
      hover: {
        filter: { type: "lighten", value: 0.4 },
      },
    },

    fill: {
      type: config.gradientType,
      gradient: {
        shadeIntensity: 0.7,
        gradientToColors: seriesConfig.map((s) =>
          shadeColor(parseColor(s.color), 20)
        ),
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    stroke: {
      width: config.strokeWidth,
      lineCap: "round",
      colors: ["var(--surface-muted)"],
    },

    plotOptions: {
      pie: {
        donut: {
          size: `${config.donutSize}%`,
          labels: {
            show: true,
            name: {
              show: config.name ?? true,
            },
            value: {
              show: config.value ?? true,
              formatter: (val) =>
                config.valuePrefix +
                Number(parseFloat(val).toFixed(2)) +
                config.valueSuffix,
            },
            total: {
              show: config.total ?? true,
              label: config.totalLabel ?? "Total",
              formatter: (w) => {
                const vals = w.config.series;
                return (
                  config.totalPrefix +
                  (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) +
                  config.totalSuffix
                );
              },
            },
          },
        },
      },
    },
  };
};
