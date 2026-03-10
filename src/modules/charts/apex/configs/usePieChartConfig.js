import { useMemo } from "react";
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

export const usePieChartConfig = ({
  chartId,
  layout,
  tooltipCallback,
  filteredSeries,
  dataSeries,
}) => {
  const seriesConfig = filteredSeries;

  /* ---------------- labels ---------------- */

  const labels = useMemo(
    () => seriesConfig.map((s) => s.label),
    [seriesConfig],
  );

  /* ---------------- colors ---------------- */

  const colors = useMemo(
    () => seriesConfig.map((s) => s.color),
    [seriesConfig],
  );

  /* ---------------- data labels ---------------- */

  const dataLabels = useMemo(
    () => ({
      enabled: layout.dataLabels,
      formatter: (val, w) => {
        const index = w.globals.seriesTotals.indexOf(+val);

        return formatValue(dataSeries[index], seriesConfig[index].type, {
          format: layout.format,
          decimals: layout.decimals,
        });
      },
    }),
    [
      layout.dataLabels,
      layout.format,
      layout.decimals,
      dataSeries,
      seriesConfig,
    ],
  );

  /* ---------------- tooltip ---------------- */

  const tooltip = useMemo(
    () => ({
      enabled: layout.tooltip,
      custom: customTooltip(tooltipCallback),
    }),
    [layout.tooltip, tooltipCallback],
  );

  /* ---------------- fill / gradient ---------------- */

  const fill = useMemo(
    () => ({
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
    }),
    [layout.gradientType, seriesConfig],
  );

  /* ---------------- stroke ---------------- */

  const stroke = useMemo(
    () => ({
      width: layout.strokeWidth,
      lineCap: "round",
      colors: ["var(--surface-muted)"],
    }),
    [layout.strokeWidth],
  );

  /* ---------------- states ---------------- */

  const states = useMemo(
    () => ({
      hover: {
        filter: { type: "lighten", value: 0.4 },
      },
    }),
    [],
  );

  /* ---------------- donut labels ---------------- */

  const donutLabels = useMemo(
    () => ({
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
    }),
    [
      layout.name,
      layout.value,
      layout.total,
      layout.totalLabel,
      layout.reducer,
      layout.format,
      layout.decimals,
      dataSeries,
      seriesConfig,
    ],
  );

  /* ---------------- plot options ---------------- */

  const plotOptions = useMemo(
    () => ({
      pie: {
        donut: {
          size: `${layout.donutSize}%`,
          labels: donutLabels,
        },
      },
    }),
    [layout.donutSize, donutLabels],
  );

  /* ---------------- final layout ---------------- */

  return useMemo(
    () => ({
      chart: { id: chartId },

      labels,
      colors,

      legend: { show: false },

      dataLabels,
      tooltip,
      states,
      fill,
      stroke,
      plotOptions,
    }),
    [
      chartId,
      labels,
      colors,
      dataLabels,
      tooltip,
      states,
      fill,
      stroke,
      plotOptions,
    ],
  );
};
