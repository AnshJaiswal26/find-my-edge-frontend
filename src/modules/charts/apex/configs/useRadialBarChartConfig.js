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

export const useRadialBarChartConfig = ({
  chartId,
  layout,
  tooltipCallback,
  filteredSeries,
  dataSeries,
}) => {
  const seriesConfig = filteredSeries;

  /* ---------------- labels ---------------- */

  const labels = useMemo(() => seriesConfig.map((s) => s.name), [seriesConfig]);

  /* ---------------- colors ---------------- */

  const colors = useMemo(
    () => seriesConfig.map((s) => s.color),
    [seriesConfig],
  );

  /* ---------------- stroke ---------------- */

  const stroke = useMemo(
    () => ({
      lineCap: layout.strokeLineCap ?? "round",
    }),
    [layout.strokeLineCap],
  );

  /* ---------------- fill / gradient ---------------- */

  const fill = useMemo(
    () => ({
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
    }),
    [layout.gradientType, seriesConfig],
  );

  /* ---------------- hover state ---------------- */

  const states = useMemo(
    () => ({
      hover: {
        filter: {
          type: "lighten",
          value: 0.9,
        },
      },
    }),
    [],
  );

  /* ---------------- radial bar labels ---------------- */

  const radialDataLabels = useMemo(
    () => ({
      name: { show: layout.name ?? true },

      value: {
        show: layout.value ?? true,
        formatter: (val, w) => {
          const index = w.layout.dataSeries.indexOf(Number(val));

          return formatValue(dataSeries[index], seriesConfig[index].type, {
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
    }),
    [
      layout.startAngle,
      layout.endAngle,
      layout.hollowSize,
      layout.strokeWidth,
      layout.trackBackground,
      radialDataLabels,
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

  /* ---------------- final layout ---------------- */

  return useMemo(
    () => ({
      chart: {
        id: chartId,
        type: "radialBar",
      },

      legend: { show: false },

      labels,
      colors,
      stroke,
      fill,
      states,
      plotOptions,
      tooltip,
    }),
    [chartId, labels, colors, stroke, fill, states, plotOptions, tooltip],
  );
};
