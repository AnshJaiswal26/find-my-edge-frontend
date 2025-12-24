const getChartStructure = (acc, [chartId, chart]) => {
  acc[chartId] = {
    // --- chart info ---
    meta: { ...chart.meta },

    // --- chart series ---
    series: {
      filtered: [...chart.data],
      default: [...chart.data],
    },

    // --- current state of chart ---
    layout: { ...chart.layout },
    seriesConfig: [...chart.seriesConfig],

    // --- instant changed states of chart
    runtime: {
      selectedLegendIndex: null,
    },

    // --- applied filters ---
    ...(chart.meta.category !== "group" && {
      filters: {
        selectedSeries: chart.seriesConfig[0].key,
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
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
