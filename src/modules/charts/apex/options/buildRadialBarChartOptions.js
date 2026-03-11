import { FunctionRegistry } from "@lib/analytics/engine/functions";
import {
  customTooltip,
  formatValue,
  parseColor,
  shadeColor,
} from "@shared/utils";

const applyReducer = (reducerName, values) => {
  const reducer = FunctionRegistry[reducerName];
  const state = reducer.init(values.length);

  for (let i = 0; i < values.length; i++) {
    reducer.step(state, values[i]);
  }

  return reducer.result(state);
};

export const buildRadialBarChartOptions = ({
  chartId,
  layout,
  tooltipCallback,
  series,
  dataSeries,
}) => {
  const seriesConfig = series;

  /* ---------------- labels ---------------- */

  const labels = seriesConfig.map((s) => s.label);

  /* ---------------- colors ---------------- */

  const colors = seriesConfig.map((s) => s.color);

  /* ---------------- stroke ---------------- */

  const stroke = {
    lineCap: layout.strokeLineCap ?? "round",
  };

  /* ---------------- fill / gradient ---------------- */

  const fill = {
    type: layout.gradientType ?? "solid",
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
  };

  /* ---------------- hover state ---------------- */

  const states = {
    hover: {
      filter: {
        type: "lighten",
        value: 0.9,
      },
    },
  };
  /* ---------------- radial bar labels ---------------- */

  const radialDataLabels = {
    name: { show: layout.name ?? true },

    value: {
      show: layout.value ?? true,
      formatter: (val, w) => {
        const index = w.globals.series.indexOf(Number(val));

        return formatValue(seriesConfig[index], seriesConfig[index].type, {
          format: seriesConfig[index].format,
          decimals: seriesConfig[index].decimals,
        });
      },
    },

    total: {
      show: layout.total ?? true,
      label: layout.totalLabel ?? "Total",
      formatter: () => {
        const result = applyReducer(layout.reducer ?? "SUM", dataSeries);

        return formatValue(result, seriesConfig[0].type, {
          format: layout.reducer !== "COUNT" ? layout.format : "NUMBER",
          decimals: layout.decimals,
        });
      },
    },
  };
  /* ---------------- plot options ---------------- */

  const plotOptions = {
    radialBar: {
      startAngle: layout.startAngle ?? 0,
      endAngle: layout.endAngle ?? 360,

      hollow: {
        size: `${layout.hollowSize ?? 50}%`,
      },

      track: {
        strokeWidth: `${layout.strokeWidth ?? 50}%`,
        background: layout.trackBackground ?? "var(--hover)",
      },

      dataLabels: radialDataLabels,
    },
  };

  /* ---------------- tooltip ---------------- */

  const tooltip = {
    enabled: layout.tooltip,
    custom: customTooltip(tooltipCallback),
  };

  /* ---------------- final layout ---------------- */

  return {
    chart: {
      id: chartId,
      type: "radialBar",
      height: "100%",
      width: "100%",
    },

    legend: { show: false },

    labels,
    colors,
    stroke,
    fill,
    states,
    plotOptions,
    tooltip,
  };
};
