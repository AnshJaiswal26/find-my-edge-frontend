export const buildChartGrid = (config) => {
  return {
    show: true,
    strokeDashArray: 3,
    xaxis: { lines: { show: config.xGrid } },
    yaxis: { lines: { show: config.yGrid } },
  };
};
