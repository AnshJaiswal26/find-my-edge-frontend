import { useMemo } from "react";
import { useCartesianChartConfig } from "./cartesian";

export const useLineChartConfig = (params) => {
  const { series, layout } = params;

  const base = useCartesianChartConfig(params);

  return useMemo(
    () => ({
      ...base,

      chart: {
        ...base.chart,
        type: layout?.area ? "area" : "line",
        stacked: false,
      },

      stroke: {
        curve: layout.curve || "smooth",
        width: layout.strokeWidth || 2,
      },

      markers: {
        size: layout.markerSize || 0,
        colors: series?.map((s) => s.markerColor) || ["var(--info)"],
        strokeWidth: 0,
        hover: { size: layout.markerHoverSize || 6 },
      },

      xaxis: base.xaxis,
      yaxis: base.yaxis,

      ...(layout.area
        ? {
            fill: {
              opacity: layout.areaOpacityFrom || 0.3,
              type: "gradient",
              gradient: {
                shade: "light",
                type: layout.areaGradientHorizontal ? "horizontal" : "vertical",
                shadeIntensity: 0,
                gradientToColors: series?.map((s) => s.areaColor) || [
                  "var(--info)",
                ],
                opacityFrom: layout.areaOpacityFrom || 0.3,
                opacityTo: layout.areaOpacityTo || 0.05,
                stops: [0, 100],
              },
            },
          }
        : {}),
    }),
    [
      base,
      layout.area,
      layout.curve,
      layout.strokeWidth,
      layout.markerSize,
      layout.markerHoverSize,
      layout.areaOpacityFrom,
      layout.areaOpacityTo,
      layout.areaGradientHorizontal,
      series,
    ],
  );
};
