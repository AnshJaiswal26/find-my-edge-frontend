import { tradeData } from "@data";
import { create } from "zustand";

const labelsKeys = "Date";

const defaultBarLayout = {
  title: "P&L Booked on Risk/Reward",
  labelsKey: labelsKeys,
  wrapperWidth: "100%",
  chartWidth: 100,

  dimensionX: 100,
  dimensionY: 250,

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
  yLabels: true,
  yLabelsColor: "var(--apexcharts-axis-labels-color)",
  yTitleText: "Risk/Reward",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "1:",
  yLabelSuffix: "",

  tooltip: true,
  dataLabels: false,
};

const winRateLayout = {
  ...defaultBarLayout,
  title: "Win and Lose Rate Over Time",
  labelsKey: "day",

  // xaxis
  xTitleText: "Days",

  //yaxis
  yTitleText: "Rate",
  yLabelPrefix: "",
  yLabelSuffix: "%",
};

const defaultBarSeriesCfg = [
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
        to: -0.01,
        color: "var(--color-red)",
        label: "Risk Taken",
      },
    ],
  },
];

const defaultLineLayout = {
  title: "P&L Over Time",
  labelsKey: labelsKeys, // same as bar chart
  wrapperWidth: "100%",
  chartWidth: 100,

  dimensionX: 100,
  dimensionY: 250,

  isVisible: false,

  // grid
  xGrid: false,
  yGrid: true,

  // line
  curve: "smooth", // straight, smooth, stepline
  strokeWidth: 2,

  // xaxis
  xTooltip: true,
  xLabels: false,
  xLabelsColor: "var(--apexcharts-axis-labels-color)",
  xTitleText: "Date",
  xTitleColor: "var(--apexcharts-axis-labels-color)",
  xLabelPrefix: "",
  xLabelSuffix: "",
  xLabelPrefixIndexing: false,
  xLabelSuffixIndexing: false,

  // yaxis
  yLabels: true,
  yLabelsColor: "var(--apexcharts-axis-labels-color)",
  yTitleText: "Pnl",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "₹",
  yLabelSuffix: "",

  tooltip: true,
  dataLabels: false,

  // markers
  markerSize: 3,
  markerColors: ["var(--color-cyan)", "var(--color-yellow)"],
  markerHoverSize: 5,
};

const defaultLineSeriesCfg = [
  {
    key: "Pnl",
    type: "line",
    label: "Pnl",
    colors: "var(--color-cyan)",
  },

  {
    key: "Cummulative Pnl",
    type: "line",
    label: "Cummulative Pnl",
    colors: "var(--color-yellow)",
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

      tempLayout: { ...defaultBarLayout },
      layout: { ...defaultBarLayout },

      seriesConfig: [...defaultBarSeriesCfg],
      tempSeriesConfig: [...defaultBarSeriesCfg],

      filters: {
        filterKey: "Risk/Reward",
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

      tempLayout: { ...winRateLayout },
      layout: { ...winRateLayout },

      seriesConfig: [...seriesCfgRate],
      tempSeriesConfig: [...seriesCfgRate],

      filters: {
        filterKey: "Win Rate",
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
    },

    "apex-line-chart-1": {
      originalSeries: [...tradeData],
      filteredSeries: [...tradeData],
      labelsKey: labelsKeys,

      tempLayout: { ...defaultLineLayout },
      layout: { ...defaultLineLayout },

      seriesConfig: [...defaultLineSeriesCfg],
      tempSeriesConfig: [...defaultLineSeriesCfg],

      filters: {
        filterKey: "Pnl",
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
    },
  },

  order: [
    { id: "apex-bar-chart-1", type: "bar" },
    { id: "apex-bar-chart-2", type: "bar" },
    { id: "apex-line-chart-1", type: "line" },
  ],

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
  updateSeriesConfig: (chartId, action) => {
    set((s) => {
      const prevSeriesCfg = s.charts[chartId].tempSeriesConfig || [];

      let updatedSeriesCfg = prevSeriesCfg;

      switch (action.type) {
        // 🟢 CREATE: Add a new series config
        case "create":
          updatedSeriesCfg = prevSeriesCfg.map((p) =>
            p.key === action.key
              ? {
                  ...p,
                  colors: [
                    ...p.colors,
                    {
                      from: 0,
                      to: 0,
                      color: "var(--color-default)",
                      label: p.key,
                    },
                  ],
                }
              : p
          );
          break;

        // 🟡 UPDATE: Modify an existing series config
        case "update":
          updatedSeriesCfg = prevSeriesCfg.map((p) =>
            p.key === action.key
              ? {
                  ...p,
                  colors: p.colors.map((range, i) =>
                    i === action.index ? { ...range, ...action.payload } : range
                  ),
                }
              : p
          );
          break;

        // 🔴 DELETE: Remove a series config by key
        case "delete":
          updatedSeriesCfg = prevSeriesCfg.map((p) => {
            return p.key === action.key
              ? { ...p, colors: p.colors.filter((_, i) => i !== action.index) }
              : p;
          });
          break;

        // optional: CLEAR ALL
        case "clear":
          updatedSeriesCfg = [];
          break;

        default:
          console.warn("Unknown action type:", action.type);
      }

      return {
        charts: {
          ...s.charts,
          [chartId]: {
            ...s.charts[chartId],
            tempSeriesConfig: updatedSeriesCfg,
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

  deleteChart: (chartId) => {
    set((s) => {
      // create a shallow copy of the charts object
      const updatedCharts = { ...s.charts };

      // delete the specific chart key
      delete updatedCharts[chartId];

      // return the new state
      return {
        charts: updatedCharts,
        order: s.order.filter((chart) => chart.id !== chartId),
      };
    });
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
