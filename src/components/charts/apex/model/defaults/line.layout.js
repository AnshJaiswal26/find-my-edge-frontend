import { CARTESIAN_LAYOUT } from "./cartesian.layout";

export const LINE_CHART_LAYOUT = {
  ...CARTESIAN_LAYOUT,
  // line
  curve: "smooth", // straight, smooth, stepline
  strokeWidth: 2,

  // markers
  markerSize: 0,
  markerHoverSize: 5,

  // area settings
  area: true, // enable/disable area fill
  areaGradientHorizontal: false, // or 'vertical'
  areaOpacityFrom: 0.3,
  areaOpacityTo: 0.05,
};
