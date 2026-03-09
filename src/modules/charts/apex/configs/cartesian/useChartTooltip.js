import { customTooltip } from "@shared/utils";
import { useMemo } from "react";

export const useChartTooltip = (config, tooltipCallback) => {
  return useMemo(
    () => ({
      enabled: config.tooltip,
      intersect: false,
      followCursor: true,
      custom: customTooltip(tooltipCallback),
    }),
    [config.tooltip, tooltipCallback],
  );
};
