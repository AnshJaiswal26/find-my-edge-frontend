import { GROUPED_CHART_LAYOUT } from "./grouped.layout";

export const RADIAL_BAR_CHART_LAYOUT = {
  ...GROUPED_CHART_LAYOUT,

  // Radial specifics
  hollowSize: 50,
  gradientType: "gradient",
  trackBackground: "var(--hover)",
  strokeWidth: 50,
  endAngle: 360,
  strokeLineCap: "round",
};
