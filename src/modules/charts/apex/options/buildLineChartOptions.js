import { buildCartesianChartOptions } from "./cartesian";

export const buildLineChartOptions = (params) => {
  const { series, layout } = params;

  const base = buildCartesianChartOptions(params);

  return {
    ...base,

    chart: {
      ...base.chart,
      type: layout?.area ? "area" : "line",
      stacked: false,
      height: "100%",
      width: "100%",
      parentHeightOffset: 0,
      redrawOnParentResize: true,
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
  };
};
