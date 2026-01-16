import { CHART_BUILDERS } from "../builders";

export function createChart(type, config) {
  if (!CHART_BUILDERS[type]) {
    throw new Error(`Unsupported chart type: ${type}`);
  }

  return CHART_BUILDERS[type](config);
}
