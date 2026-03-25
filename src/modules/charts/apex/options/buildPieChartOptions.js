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

export const buildPieChartOptions = ({
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

  /* ---------------- data labels ---------------- */

  const dataLabels = {
    enabled: layout.dataLabels,
    formatter: (val, w) => {
      const index = w.globals.seriesTotals.indexOf(+val);

      return formatValue(seriesConfig[index].value, seriesConfig[index].type, {
        format: layout.format,
        decimals: layout.decimals,
      });
    },
  };

  /* ---------------- tooltip ---------------- */

  const tooltip = {
    enabled: layout.tooltip,
    custom: customTooltip(tooltipCallback),
  };

  /* ---------------- fill / gradient ---------------- */

  const fill = {
    type: layout.gradientType,
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
  };

  /* ---------------- stroke ---------------- */

  const stroke = {
    width: layout.strokeWidth,
    lineCap: "round",
    colors: ["var(--surface-muted)"],
  };
  /* ---------------- states ---------------- */

  const states = {
    hover: {
      filter: { type: "lighten", value: 0.4 },
    },
  };
  /* ---------------- donut labels ---------------- */

  const donutLabels = {
    show: true,

    name: {
      show: layout.name ?? true,
    },

    value: {
      show: layout.value ?? true,
      formatter: (val, w) => {
        const index = w.globals.seriesTotals.indexOf(+val);

        return formatValue(dataSeries[index], seriesConfig[index].type, {
          format: layout.format,
          decimals: layout.decimals,
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
    pie: {
      donut: {
        size: `${layout.donutSize}%`,
        labels: donutLabels,
      },
    },
  };
  /* ---------------- final layout ---------------- */

  return {
    chart: {
      id: chartId,
      height: "100%",
      width: "100%",
      type: "donut",
    },

    labels,
    colors,

    legend: { show: false },

    dataLabels,
    tooltip,
    states,
    fill,
    stroke,
    plotOptions,
  };
};
