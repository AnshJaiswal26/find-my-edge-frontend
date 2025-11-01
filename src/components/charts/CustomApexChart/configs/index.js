import { getBarChartConfig } from "./barChartConfig";
import { getLineChartConfig } from "./lineChartConfig";
import { getRadialBarChartConfig } from "./radialBarChartCofig";

export const configGenerator = {
  bar: getBarChartConfig,
  line: getLineChartConfig,
  radialBar: getRadialBarChartConfig,
};
