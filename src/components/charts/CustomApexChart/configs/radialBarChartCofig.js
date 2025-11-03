import { customTooltip, parseColor, shadeColor } from "@utils";

export const getRadialBarChartConfig = ({
  chartId,
  chart,
  tooltipCallback,
}) => {
  const config = chart.live.layout;
  const seriesConfig = chart.live.seriesConfig;

  return {
    chart: {
      id: chartId,
      type: "radialBar",
    },

    legend: {
      show: false,
      position: "bottom", // top | bottom
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    stroke: {
      lineCap: "round", // "round" | "square"
    },

    fill: {
      gradient: {
        shadeIntensity: 0.7,
        gradientToColors: seriesConfig.map((s) => shadeColor(s.color, 20)),
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 70, 50, 0],
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.3,
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
          background: "var(--color-bg-hover)",
        },
        dataLabels: {
          showOn: config.showOn ?? "always",
          name: { show: config.name ?? true },
          value: {
            show: config.value ?? true,
            formatter: (val) => val + "%",
          },
          total: {
            show: config.total ?? true,
            // formatter: ({ value }) => {
            //   console.log(value);
            //   parseFloat(value).toFixed(2);
            // },
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
