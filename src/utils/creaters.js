const getChartStructure = (acc, [chartId, chart]) => {
  acc[chartId] = {
    // --- chart info ---
    meta: { ...chart.meta },

    // --- chart series ---
    series: {
      filtered: [...chart.data],
      default: [...chart.data],
    },

    sort: {
      columnId: null,
      operator: "none",
    },

    filteredOrder: [],
    sortedOrder: [],

    // --- current state of chart ---
    layout: { ...chart.layout },
    seriesConfig: [...chart.seriesConfig],
    xSeriesConfig: chart.xSeriesConfig,

    // --- instant changed states of chart
    runtime: {
      selectedLegendIndex: null,
    },

    // --- applied filters ---
    ...(chart.meta.category !== "group" && {
      filters: [],
    }),
  };
  return acc;
};

export const generateCharts = (charts) => {
  const config = Object.entries(charts).reduce((acc, [_, chartObj]) => {
    acc = Object.entries(chartObj).reduce(getChartStructure, acc);

    return acc;
  }, {});

  return config;
};
