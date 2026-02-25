import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions";
import {
  customTooltip,
  formatValue,
  parseColor,
  shadeColor,
} from "@shared/utils";

const applyReducer = (reducerName, values) => {
  const reducer = FUNCTION_REGISTRY[reducerName];
  const state = reducer.init(values.length);
  for (let i = 0; i < values.length; i++) {
    reducer.step(state, values[i]);
  }
  return reducer.result(state);
};

export const getPieChartConfig = ({
  chartId,
  chart,
  series,
  tooltipCallback,
  filteredConfig,
}) => {
  const config = chart.layout;

  const seriesConfig = filteredConfig;

  return {
    chart: {
      id: chartId,
    },

    labels: seriesConfig.map((s) => s.name),
    colors: seriesConfig.map((s) => s.color),

    legend: { show: false },

    dataLabels: {
      enabled: config.dataLabels,
      formatter: (val, w) => {
        const index = w.globals.seriesTotals.findIndex((v) => v === +val);
        formatValue(series[index], seriesConfig[index].type, {
          format: config.format,
          decimals: config.decimals,
        });
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
              formatter: (val, w) => {
                const index = w.globals.seriesTotals.findIndex(
                  (v) => v === +val,
                );
                return formatValue(series[index], seriesConfig[index].type, {
                  format: config.format,
                  decimals: config.decimals,
                });
              },
            },
            total: {
              show: config.total ?? true,
              label: config.totalLabel ?? "Total",
              formatter: () => {
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
    },
  };
};
