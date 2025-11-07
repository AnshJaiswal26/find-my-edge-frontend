import { defaultCharts } from "@data";

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
    live: {
      layout: { ...chart.layout },
      seriesConfig: [...chart.seriesConfig],
    },

    // --- temprory state of chart popups ---
    draft: {
      layout: { ...chart.layout },
      seriesConfig: [...chart.seriesConfig],
    },

    // --- instant changed states of chart
    runtime: {
      selectedLegendIndex: null,
    },

    // --- applied filters ---
    ...(chart.meta.type !== "radialBar" &&
      chart.meta.type !== "donut" &&
      chart.meta.type !== "radar" && {
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
  const config = Object.entries(defaultCharts).reduce(
    (acc, [type, chartObj]) => {
      acc = Object.entries(chartObj).reduce(getChartStructure, acc);

      return acc;
    },
    {}
  );
  const barAcc = Object.entries(defaultCharts.bar).reduce(
    getChartStructure,
    {}
  );
  const barLineAcc = Object.entries(defaultCharts.line).reduce(
    getChartStructure,
    barAcc
  );
  const barLinePieAcc = Object.entries(defaultCharts.pie).reduce(
    getChartStructure,
    barLineAcc
  );

  const barLineRadialBarPieAcc = Object.entries(defaultCharts.radialBar).reduce(
    getChartStructure,
    barLinePieAcc
  );

  return config;
};
