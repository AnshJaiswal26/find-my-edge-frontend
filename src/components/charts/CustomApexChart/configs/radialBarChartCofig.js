import { parseColor, shadeColor } from "@utils";

export const getRadialBarChartConfig = ({ chartId, chart, chartRef }) => {
  const config = chart.layout;
  const seriesConfig = chart.seriesConfig;

  return {
    chart: {
      id: chartId,
      type: "radialBar",

      events: {
        // dataPointMouseEnter: (event, chartContext, config) => {
        //   const index = config.dataPointIndex;
        //   setActiveIndex(index);
        // },
        // dataPointMouseLeave: () => {
        //   setActiveIndex(null);
        // },
        mounted: (ctx) => (chartRef.current = ctx.el),
      },
    },

    legend: {
      show: false,
      position: "bottom",
      labels: {
        colors: "#ffffff",
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    stroke: {
      lineCap: "round", //  "butt" | "round" | "square"
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.8,
        gradientToColors: seriesConfig.map((s) =>
          shadeColor(parseColor(s.color), 20)
        ),
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 0],
      },
    },

    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.8,
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
            formatter: () => 70,
          },
        },
      },
    },
    labels: seriesConfig.map((s) => s.name),
    colors: seriesConfig.map((s) => s.color),

    tooltip: {
      enabled: config.tooltip,
    },
  };
};
