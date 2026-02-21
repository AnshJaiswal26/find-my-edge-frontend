import { GROUPED_CHART_LAYOUT } from "./grouped.layout";

export const PIE_CHART_LAYOUT = {
  ...GROUPED_CHART_LAYOUT,

  // Pie/Donut specifics
  donutSize: 70,
  gradientType: "gradient",
  strokeWidth: 0,

  dataLabels: false,
};
