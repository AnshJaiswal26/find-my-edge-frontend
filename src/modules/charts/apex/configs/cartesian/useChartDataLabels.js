import { useMemo } from "react";

export const useChartDataLabels = (type, config) => {
  return useMemo(
    () => ({
      enabled: config.dataLabels,
      style: { fontSize: "0.75rem" },
      ...(type === "bar" && {
        offsetY: 7,
        position: "middle",
      }),
    }),
    [config.dataLabels, type],
  );
};
