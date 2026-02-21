import { buildBarChart, buildBarSeriesConfig } from "./barChart.builder";
import { buildLineChart, buildLineSeriesConfig } from "./lineChart.builder";
import { buildDonutChart, buildDonutSeriesConfig } from "./pieChart.builder";
import {
  buildPolarAreaChart,
  buildPolarSeriesConfig,
} from "./polarAreaChart.builder";
import { buildRadarChart, buildRadarSeriesConfig } from "./radarChart.builder";
import {
  buildRadialBarChart,
  buildRadialSeriesConfig,
} from "./radialBarChart.builder";

export const CHART_BUILDERS = {
  bar: buildBarChart,
  line: buildLineChart,
  donut: buildDonutChart,
  radialBar: buildRadialBarChart,
  radar: buildRadarChart,
  polarArea: buildPolarAreaChart,
};

export const CHART_SERIES_CONFIG_BUILDERS = {
  bar: buildBarSeriesConfig,
  line: buildLineSeriesConfig,
  donut: buildDonutSeriesConfig,
  radialBar: buildRadialSeriesConfig,
  radar: buildRadarSeriesConfig,
  polarArea: buildPolarSeriesConfig,
};
