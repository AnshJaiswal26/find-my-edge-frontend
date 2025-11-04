import { customTooltip, parseColor, shadeColor } from "@utils";

export const getRadialBarChartConfig = ({
  chartId,
  chart,
  tooltipCallback,
}) => {
  const config = chart.live.layout;

  const index = chart.runtime.selectedLegendIndex;
  const seriesConfig =
    index !== null ? [chart.live.seriesConfig[index]] : chart.live.seriesConfig;

  return {
    chart: {
      id: chartId,
      type: "radialBar",
    },

    legend: { show: false },
    stroke: {
      lineCap: config.strokeLineCap ?? "round", // "round" | "square"
    },

    fill: {
      type: config.gradientType ?? "solid", // gradient | solid
      gradient: {
        shadeIntensity: 0.7,
        gradientToColors: seriesConfig.map((s) =>
          shadeColor(parseColor(s.color), 20)
        ),
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 70, 100],
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.9,
        },
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: config.startAngle ?? 0,
        endAngle: config.endAngle ?? 360,
        hollow: { size: config.hollowSize ?? "50%" },
        track: {
          strokeWidth: config.strokeWidth ?? "50%",
          background: config.trackBackground ?? "var(--color-bg-hover)",
        },
        dataLabels: {
          showOn: config.showOn ?? "always",
          name: { show: config.name ?? true },
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
              return (
                config.totalPrefix +
                w.config.series.reduce((acc, v) => {
                  acc += v;
                  return acc;
                }, 0) +
                config.totalSuffix
              );
            },
          },
        },
      },
    },
    labels: seriesConfig.map((s) => s.name),
    colors: seriesConfig.map((s) => s.color),

    tooltip: {
      enabled: config.tooltip,
      custom: customTooltip(tooltipCallback),
    },
  };
};
