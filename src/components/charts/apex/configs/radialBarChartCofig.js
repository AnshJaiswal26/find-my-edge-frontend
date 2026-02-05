import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { customTooltip, formatValue, parseColor, shadeColor } from "@utils";

const applyReducer = (reducerName, values) => {
  const reducer = FUNCTION_REGISTRY[reducerName].reducer;
  const state = reducer.init(values.length);
  for (let i = 0; i < values.length; i++) {
    reducer.step(state, values[i]);
  }
  return reducer.result(state);
};

export const getRadialBarChartConfig = ({
  chartId,
  chart,
  tooltipCallback,
  filteredConfig,
  series,
}) => {
  const config = chart.layout;

  const seriesConfig = filteredConfig;

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
          shadeColor(parseColor(s.color), 20),
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
        hollow: { size: `${config.hollowSize}%` ?? "50%" },
        track: {
          strokeWidth: `${config.strokeWidth}%` ?? "50%",
          background: config.trackBackground ?? "var(--hover)",
        },
        dataLabels: {
          name: { show: config.name ?? true },
          value: {
            show: config.value ?? true,
            formatter: (val, w) => {
              const index = w.config.series.indexOf(Number(val));
              return formatValue(series[index], seriesConfig[index].type, {
                format: seriesConfig[index].format,
                decimals: seriesConfig[index].decimals,
              });
            },
          },
          total: {
            show: config.total ?? true,
            label: config.totalLabel ?? "Total",
            formatter: (w) => {
              const result = applyReducer(config.reducer ?? "SUM", series);
              return formatValue(result, seriesConfig[0].type, {
                format: config.reducer !== "COUNT" ? config.format : "NUMBER",
                decimals: config.decimals,
              });
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
