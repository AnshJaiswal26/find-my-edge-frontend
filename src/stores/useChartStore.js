import { tradeData } from "@data";
import { create } from "zustand";

const labelsKeys = "Date";

const defaultLayout = {
  title: "P&L Booked on Risk/Reward",
  labelsKey: labelsKeys,
  wrapperWidth: "100%",
  chartWidth: 100,

  dimensionX: 100,
  dimensionY: 400,

  isVisible: false,

  // grid
  xGrid: false,
  yGrid: true,

  // bar
  horizontal: false,

  stacked: false,
  stacked100: false,
  barRadius: 1,

  // xaxis
  xTooltip: true,
  xLabels: false,
  xLabelsColor: "var(--apexcharts-axis-labels-color)",
  xTitleText: "Trades",
  xTitleColor: "var(--apexcharts-axis-labels-color)",
  xLabelPrefix: "",
  xLabelSuffix: "",
  xLabelPrefixIndexing: false,
  xLabelSuffixIndexing: false,

  //yaxis
  yTooltip: false,
  yLabels: true,
  yLabelsColor: "var(--apexcharts-axis-labels-color)",
  yTitleText: "Risk/Reward",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "1:",
  yLabelSuffix: "",

  tooltip: true,
  dataLabels: false,
};

const defaultLayoutWinRate = {
  title: "Win and Lose Rate Over Time",
  labelsKey: "day",
  wrapperWidth: "100%",
  chartWidth: 100,

  dimensionX: 100,
  dimensionY: 300,

  isVisible: false,

  // grid
  xGrid: false,
  yGrid: true,

  // bar
  horizontal: false,

  stacked: false,
  stacked100: false,
  barRadius: 1,

  // xaxis
  xTooltip: true,
  xLabels: false,
  xLabelsColor: "var(--apexcharts-axis-labels-color)",
  xTitleText: "Days",
  xTitleColor: "var(--apexcharts-axis-labels-color)",
  xLabelPrefix: "",
  xLabelSuffix: "",
  xLabelPrefixIndexing: false,
  xLabelSuffixIndexing: false,

  //yaxis
  yTooltip: false,
  yLabels: true,
  yLabelsColor: "var(--apexcharts-axis-labels-color)",
  yTitleText: "Rate",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "",
  yLabelSuffix: "%",

  tooltip: true,
  dataLabels: false,
};

const defaultSeriesCfg = [
  {
    key: "Risk/Reward",
    type: "bar",
    colors: [
      {
        from: 0.61,
        to: Number.MAX_SAFE_INTEGER,
        color: "var(--color-green)",
        label: "Reward Taken",
      },
      {
        from: 0,
        to: 0.6,
        color: "var(--color-yellow)",
        label: "Breakeven",
      },
      {
        from: Number.MIN_SAFE_INTEGER,
        to: -0.00001,
        color: "var(--color-red)",
        label: "Risk Taken",
      },
    ],
  },
];

const demoWinRateData = [
  { day: "Day 1", "Win Rate": 55, "Lose Rate": 45 },
  { day: "Day 2", "Win Rate": 60, "Lose Rate": 40 },
  { day: "Day 3", "Win Rate": 70, "Lose Rate": 30 },
  { day: "Day 4", "Win Rate": 50, "Lose Rate": 50 },
  { day: "Day 5", "Win Rate": 65, "Lose Rate": 35 },
  { day: "Day 6", "Win Rate": 58, "Lose Rate": 42 },
  { day: "Day 7", "Win Rate": 62, "Lose Rate": 38 },
];

const seriesCfgRate = [
  {
    key: "Win Rate",
    type: "bar",
    colors: [
      {
        from: 0,
        to: Math.max(...demoWinRateData.map((item) => item["Win Rate"])),
        color: "var(--color-green)",
        label: "Win Rate",
      },
    ],
  },
  {
    key: "Lose Rate",
    type: "bar",
    colors: [
      {
        from: 0,
        to: Math.max(...demoWinRateData.map((item) => item["Lose Rate"])),
        color: "var(--color-red)",
        label: "Lose Rate",
      },
    ],
  },
];

export const useChartStore = create((set) => ({
  charts: {
    activeChart: { id: "", type: "" },
    "apex-bar-chart-1": {
      originalSeries: [...tradeData],
      filteredSeries: [...tradeData],
      labelsKey: labelsKeys,

      tempLayout: { ...defaultLayout },
      layout: { ...defaultLayout },

      seriesConfig: [...defaultSeriesCfg],
      tempSeriesConfig: [...defaultSeriesCfg],

      filters: {
        filterKey: "Risk/Reward",
        visible: false,
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
    },

    "apex-bar-chart-2": {
      originalSeries: [...demoWinRateData],
      filteredSeries: [...demoWinRateData],
      labelsKey: "day",

      tempLayout: { ...defaultLayoutWinRate },
      layout: { ...defaultLayoutWinRate },

      seriesConfig: [...seriesCfgRate],
      tempSeriesConfig: [...seriesCfgRate],

      filters: {
        filterKey: "Win Rate",
        visible: false,
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
    },
  },

  order: [],

  updateActiveChart: (updates) => {
    set((s) => ({
      charts: {
        ...s.charts,
        activeChart: { ...s.charts.activeChart, ...updates },
      },
    }));
  },

  // --- Meta (general chart info)
  updateMeta: (chartId, meta) => {
    set((s) => ({
      charts: {
        ...s.charts, // new root charts object
        [chartId]: {
          ...s.charts[chartId], // new chart object
          ...meta, // update meta properties
        },
      },
    }));
  },

  // --- Layout
  updateLayout: (chartId, layoutUpdates, key = "layout") => {
    const isValidKey = key === "layout" || key === "tempLayout";
    const field = isValidKey ? key : "layout";
    set((s) => ({
      charts: {
        ...s.charts, // new root charts object
        [chartId]: {
          ...s.charts[chartId], // new chart object
          [field]: {
            ...s.charts[chartId][field],
            ...layoutUpdates, // updated layout
          },
        },
      },
    }));
  },

  // --- Series Config
  updateSeriesConfig: (chartId, configUpdates) => {
    set((s) => {
      const prevSeriesCfg = s.charts[chartId].tempSeriesConfig;

      return {
        charts: {
          ...s.charts, // new root charts object
          [chartId]: {
            ...s.charts[chartId], // new chart object
            tempSeriesConfig: prevSeriesCfg.map((p) =>
              p.key === configUpdates.key
                ? p.type === "bar"
                  ? {
                      ...p,
                      colors: p.colors.map((item, i) =>
                        i === configUpdates?.index
                          ? { ...item, ...configUpdates.payload }
                          : item
                      ),
                    }
                  : { ...p, colors: configUpdates }
                : p
            ),
          },
        },
      };
    });
  },

  // --- Series Config Merge
  updateSeriesConfigMerge: (chartId, key = "merge") => {
    set((s) => {
      const field = key === "reset" ? "tempSeriesConfig" : "seriesConfig";
      const chart = s.charts[chartId];

      return {
        charts: {
          ...s.charts, // new root charts object
          [chartId]: {
            ...s.charts[chartId], // new chart object
            [field]:
              key === "reset" ? chart.seriesConfig : chart.tempSeriesConfig,
          },
        },
      };
    });
  },

  // --- Filters
  updateFilters: (chartId, filterUpdates) => {
    set((s) => ({
      charts: {
        ...s.charts, // new root object
        [chartId]: {
          ...s.charts[chartId], // new chart object
          filters: {
            ...s.charts[chartId].filters,
            ...filterUpdates, // updated filters
          },
        },
      },
    }));
  },

  // --- Series
  updateSeries: (chartId, series) => {
    set((s) => ({
      charts: {
        ...s.charts, // new root charts object
        [chartId]: {
          ...s.charts[chartId], // new chart object
          filteredSeries: series, // updated series
        },
      },
    }));
  },

  // --- Reset Series
  resetSeries: (chartId) => {
    set((s) => ({
      charts: {
        ...s.charts, // new reference for root charts object
        [chartId]: {
          ...s.charts[chartId], // new reference for this chart
          filteredSeries: s.charts[chartId].originalSeries, // updated series
        },
      },
    }));
  },
}));
