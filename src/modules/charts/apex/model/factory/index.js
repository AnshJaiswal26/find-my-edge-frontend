import { CHART_BUILDERS, CHART_SERIES_CONFIG_BUILDERS } from "../builders";

export function createChart(type, config) {
  if (!CHART_BUILDERS[type]) {
    throw new Error(`Unsupported chart type: ${type}`);
  }

  return CHART_BUILDERS[type](config);
}

export function createChartSeriesConfig(type, config) {
  if (!CHART_SERIES_CONFIG_BUILDERS[type]) {
    throw new Error(`Unsupported chart config type: ${type}`);
  }

  return CHART_SERIES_CONFIG_BUILDERS[type](config);
}
