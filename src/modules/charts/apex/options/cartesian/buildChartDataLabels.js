export const buildChartDataLabels = (type, config) => {
  return {
    enabled: config.dataLabels,
    style: { fontSize: "0.75rem" },
    ...(type === "bar" && {
      offsetY: 7,
      position: "middle",
    }),
  };
};
