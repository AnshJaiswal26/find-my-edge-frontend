import { tradeData } from "@data";
import { create } from "zustand";

const xLabelsKeys = "Date";

const defaultLayoutBar1 = {
  title: "P&L Booked on Risk/Reward",
  xLabelsKey: xLabelsKeys,
  wrapperWidth: "100%",
  chartWidth: 100,

  selection: false,

  dimensionX: 100,
  dimensionY: 250,

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

const defaultLayoutBar2 = {
  ...defaultLayoutBar1,
  title: "Win and Lose Rate Over Time",
  xLabelsKey: "day",

  // xaxis
  xTitleText: "Days",

  //yaxis
  yTitleText: "Rate",
  yLabelPrefix: "",
  yLabelSuffix: "%",
};

const seriesColorBar1 = {
  "Risk/Reward": [
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
};

const defaultLayoutLine1 = {
  title: "P&L Over Time",
  xLabelsKey: xLabelsKeys, // same as bar chart
  wrapperWidth: "100%",
  chartWidth: 100,

  dimensionX: 100,
  dimensionY: 250,

  selection: true,

  // grid
  xGrid: false,
  yGrid: true,

  // line
  curve: "smooth", // straight, smooth, stepline
  strokeWidth: 2,

  // markers
  markerSize: 0,
  markerColors: ["var(--color-cyan)", "var(--color-yellow)"],
  markerHoverSize: 5,

  // area settings
  area: true, // enable/disable area fill
  areaColors: ["var(--color-cyan)", "var(--color-yellow)"], // per series
  areaGradientHorizontal: false, // or 'vertical'
  areaOpacityFrom: 0.3,
  areaOpacityTo: 0.05,

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
};

const seriesBar2 = [
  { day: "Day 1", "Win Rate": 55, "Lose Rate": 45 },
  { day: "Day 2", "Win Rate": 60, "Lose Rate": 40 },
  { day: "Day 3", "Win Rate": 70, "Lose Rate": 30 },
  { day: "Day 4", "Win Rate": 50, "Lose Rate": 50 },
  { day: "Day 5", "Win Rate": 65, "Lose Rate": 35 },
  { day: "Day 6", "Win Rate": 58, "Lose Rate": 42 },
  { day: "Day 7", "Win Rate": 62, "Lose Rate": 38 },
];

const seriesColorBar2 = {
  "Win Rate": [
    {
      from: 0,
      to: Number.MAX_SAFE_INTEGER,
      color: "var(--color-green)",
      label: "Win Rate",
    },
  ],
  "Lose Rate": [
    {
      from: 0,
      to: Number.MAX_SAFE_INTEGER,
      color: "var(--color-red)",
      label: "Lose Rate",
    },
  ],
};

export const useChartStore = create((set) => ({
  charts: {
    activeChart: { id: "", type: "" },
    "apex-bar-chart-1": {
      originalSeries: [...tradeData],
      filteredSeries: [...tradeData],
      xLabelsKey: xLabelsKeys,

      tempLayout: { ...defaultLayoutBar1 },
      layout: { ...defaultLayoutBar1 },

      series: ["Risk/Reward"],
      tempSeries: ["Risk/Reward"],

      seriesColors: { ...seriesColorBar1 },
      tempSeriesColors: { ...seriesColorBar1 },

      filters: {
        selectedSeries: "Risk/Reward",
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
    },

    "apex-bar-chart-2": {
      originalSeries: [...seriesBar2],
      filteredSeries: [...seriesBar2],
      xLabelsKey: "day",

      tempLayout: { ...defaultLayoutBar2 },
      layout: { ...defaultLayoutBar2 },

      series: ["Win Rate", "Lose Rate"],
      tempSeries: ["Win Rate", "Lose Rate"],

      seriesColors: { ...seriesColorBar2 },
      tempSeriesColors: { ...seriesColorBar2 },

      filters: {
        selectedSeries: "Win Rate",
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
      xLabelsKey: xLabelsKeys,

      tempLayout: { ...defaultLayoutLine1 },
      layout: { ...defaultLayoutLine1 },

      series: ["Pnl", "Cummulative Pnl"],
      tempSeries: ["Pnl", "Cummulative Pnl"],

      seriesColors: {
        Pnl: { color: "var(--color-cyan)", label: "Pnl" },
        "Cummulative Pnl": {
          color: "var(--color-yellow)",
          label: "Cummulative Pnl",
        },
      },

      tempSeriesColors: {
        Pnl: { color: "var(--color-cyan)", label: "Pnl" },
        "Cummulative Pnl": {
          color: "var(--color-yellow)",
          label: "Cummulative Pnl",
        },
      },

      filters: {
        selectedSeries: "Pnl",
        selectedFilter: "none",
        selectedSort: "none",
        value: "",
        from: "",
        to: "",
      },
    },

    "apex-line-chart-2": {
      originalSeries: [...tradeData],
      filteredSeries: [...tradeData],
      xLabelsKey: xLabelsKeys,

      tempLayout: {
        ...defaultLayoutLine1,
        title: "Capital Growth",
        markerColors: ["var(--color-yellow)"],
        areaColors: ["var(--color-yellow)"],
      },
      layout: {
        ...defaultLayoutLine1,
        title: "Capital Growth",
        markerColors: ["var(--color-yellow)"],
        areaColors: ["var(--color-yellow)"],
      },

      seriesConfig: [
        {
          key: "Capital",
          type: "line",
          label: "Captial",
          colors: "var(--color-yellow)",
        },
      ],
      tempSeriesConfig: [
        {
          key: "Capital",
          type: "line",
          label: "Captial",
          colors: "var(--color-yellow)",
        },
      ],

      series: ["Capital"],
      tempSeries: ["Capital"],

      seriesColors: {
        Capital: { color: "var(--color-yellow)", label: "Capital" },
      },
      tempSeriesColors: {
        Capital: { color: "var(--color-yellow)", label: "Capital" },
      },

      filters: {
        selectedSeries: "Capital",
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
    { id: "apex-line-chart-2", type: "line" },
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
      const chart = s.charts[chartId];
      const prevSeriesColors = chart.tempSeriesColors || {};

      // Clone to avoid mutating state
      const updatedSeriesColors = { ...prevSeriesColors };

      switch (action.type) {
        // 🟢 CREATE: Add a new color range for the given series key
        case "create": {
          const prevColors = prevSeriesColors[action.key] || [];
          updatedSeriesColors[action.key] = [
            ...prevColors,
            {
              from: 0,
              to: 0,
              color: "var(--color-default)",
              label: "",
            },
          ];
          break;
        }

        // 🟡 UPDATE: Update specific color range at index
        case "update": {
          const prevColors = prevSeriesColors[action.key] || [];
          updatedSeriesColors[action.key] = prevColors.map((range, i) =>
            i === action.index ? { ...range, ...action.payload } : range
          );
          break;
        }

        // 🔴 DELETE: Remove color range by index for a specific key
        case "delete": {
          const prevColors = prevSeriesColors[action.key] || [];
          updatedSeriesColors[action.key] = prevColors.filter(
            (_, i) => i !== action.index
          );
          break;
        }

        default:
          console.warn("Unknown action type:", action.type);
      }

      return {
        charts: {
          ...s.charts,
          [chartId]: {
            ...chart,
            tempSeriesColors: updatedSeriesColors,
          },
        },
      };
    });
  },

  // --- Series Config Merge
  updateSeriesConfigMerge: (chartId, key = "merge") => {
    set((s) => {
      const field = key === "reset" ? "tempSeriesColor" : "seriesColor";
      const chart = s.charts[chartId];

      return {
        charts: {
          ...s.charts, // new root charts object
          [chartId]: {
            ...s.charts[chartId], // new chart object
            [field]:
              key === "reset" ? chart.seriesColor : chart.tempSeriesColors,
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

  updateChart: (chartId, updates) => {
    set((s) => {
      const chart = s.charts[chartId];
      if (!chart) return s;

      const chartUpdate = {};

      const entries = Object.entries(updates);

      entries.forEach(([key, value]) => {
        console.log(key, value);
        if (typeof value === "function") {
          const result = value(chart[key], chart, s);

          chartUpdate[key] = Array.isArray(result)
            ? result
            : { ...chart[key], ...value(chart[key], chart, s) };
        } else {
          chartUpdate[key] = Array.isArray(value)
            ? value
            : { ...chart[key], ...value };
        }
      });

      return entries.length
        ? {
            charts: {
              ...s.charts,
              [chartId]: {
                ...chart,
                ...chartUpdate,
              },
            },
          }
        : s;
    });
  },
}));
