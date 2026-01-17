import { buildBarChart } from "./barChart.builder";
import { buildLineChart } from "./lineChart.builder";
import { buildDonutChart } from "./pieChart.builder";
import { buildPolarAreaChart } from "./polarAreaChart.builder";
import { buildRadarChart } from "./radarChart.builder";
import { buildRadialBarChart } from "./radialBarChart.builder";

export const CHART_BUILDERS = {
  bar: buildBarChart,
  line: buildLineChart,
  donut: buildDonutChart,
  radialBar: buildRadialBarChart,
  radar: buildRadarChart,
  polarArea: buildPolarAreaChart,
};
