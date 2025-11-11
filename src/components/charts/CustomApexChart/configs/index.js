import { getBarChartConfig } from "./barChartConfig";
import { getLineChartConfig } from "./lineChartConfig";
import { getPieChartConfig } from "./pieChartConfig";
import { getRadarChartConfig } from "./radarChartConfig";
import { getRadialBarChartConfig } from "./radialBarChartCofig";
import { getPolarChartConfig } from "./polarChartConfig";

export const configGenerator = {
  bar: getBarChartConfig,
  line: getLineChartConfig,
  donut: getPieChartConfig,
  radialBar: getRadialBarChartConfig,
  radar: getRadarChartConfig,
  polarArea: getPolarChartConfig,
};
