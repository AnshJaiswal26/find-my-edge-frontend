import { customTooltip } from "@shared/utils";

export const buildChartTooltip = (config, tooltipCallback) => {
  return {
    enabled: config.tooltip,
    intersect: false,
    followCursor: true,
    shared: false,
    custom: customTooltip(tooltipCallback),
  };
};
