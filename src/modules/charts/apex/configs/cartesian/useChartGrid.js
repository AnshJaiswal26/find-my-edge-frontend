import { useMemo } from "react";

export const useChartGrid = (config) => {
  return useMemo(
    () => ({
      show: true,
      strokeDashArray: 3,
      xaxis: { lines: { show: config.xGrid } },
      yaxis: { lines: { show: config.yGrid } },
    }),
    [config.xGrid, config.yGrid],
  );
};
