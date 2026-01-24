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

export const getPieChartConfig = ({
  chartId,
  chart,
  tooltipCallback,
  selectedSeriesKeys,
}) => {
  const config = chart.layout;

  const seriesConfig = selectedSeriesKeys
    ? chart.seriesConfig.filter((s) => selectedSeriesKeys.includes(s.key))
    : chart.seriesConfig;

  return {
    chart: {
      id: chartId,
    },

    labels: seriesConfig.map((s) => s.name),
    colors: seriesConfig.map((s) => s.color),

    legend: { show: false },

    dataLabels: {
      enabled: config.dataLabels,
      formatter: (val) =>
        formatValue(val, seriesConfig[0].type, {
          format: config.format,
          decimals: config.decimals,
        }),
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
          shadeColor(parseColor(s.color), 20),
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
                formatValue(val, seriesConfig[0].type, {
                  format: config.format,
                  decimals: config.decimals,
                }),
            },
            total: {
              show: config.total ?? true,
              label: config.totalLabel ?? "Total",
              formatter: (w) => {
                const vals = w.config.series;
                const result = applyReducer(config.reducer ?? "SUM_N", vals);
                return formatValue(result, seriesConfig[0].type, {
                  format:
                    config.reducer !== "COUNT_N" ? config.format : "NUMBER",
                  decimals: config.decimals,
                });
              },
            },
          },
        },
      },
    },
  };
};
