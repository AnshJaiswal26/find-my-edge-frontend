import {
  defaultLayoutBar1,
  defaultLayoutBar2,
  defaultLayoutLine1,
  defaultLayoutLine2,
  defaultLayoutLine3,
  defaultLayoutRadial1,
  radialData,
  seriesBar2,
  seriesConfigBar1,
  seriesConfigBar2,
  seriesConfigLine1,
  seriesConfigLine2,
  seriesConfigLine3,
  seriesConfigRadial1,
  tradeData,
} from "@data";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const xLabelsKeys = "Date";

export const useChartStore = create(
  immer((set) => ({
    charts: {
      activeChart: { id: "", type: "" },
      "apex-bar-chart-1": {
        originalSeries: [...tradeData],
        filteredSeries: [...tradeData],
        xLabelsKey: xLabelsKeys,

        tempLayout: { ...defaultLayoutBar1 },
        layout: { ...defaultLayoutBar1 },

        seriesConfig: [...seriesConfigBar1],
        tempSeriesConfig: [...seriesConfigBar1],

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

        seriesConfig: [...seriesConfigBar2],
        tempSeriesConfig: [...seriesConfigBar2],

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

        seriesConfig: [...seriesConfigLine1],
        tempSeriesConfig: [...seriesConfigLine1],

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

        tempLayout: { ...defaultLayoutLine2 },
        layout: { ...defaultLayoutLine2 },

        seriesConfig: [...seriesConfigLine2],
        tempSeriesConfig: [...seriesConfigLine2],

        filters: {
          selectedSeries: "Capital",
          selectedFilter: "none",
          selectedSort: "none",
          value: "",
          from: "",
          to: "",
        },
      },

      "apex-line-chart-3": {
        originalSeries: [...tradeData],
        filteredSeries: [...tradeData],
        xLabelsKey: xLabelsKeys,

        tempLayout: { ...defaultLayoutLine3 },
        layout: { ...defaultLayoutLine3 },

        seriesConfig: [...seriesConfigLine3],
        tempSeriesConfig: [...seriesConfigLine3],

        filters: {
          selectedSeries: "Profit",
          selectedFilter: "none",
          selectedSort: "none",
          value: "",
          from: "",
          to: "",
        },
      },

      // "radar-chart-1": {
      //   originalSeries: [...radarData],
      //   filteredSeries: [...radarData],
      //   xLabelsKey: "axis",

      //   tempLayout: { ...defaultLayoutRadar1 },
      //   layout: { ...defaultLayoutRadar1 },

      //   seriesConfig: [...seriesConfigRadar1],
      //   tempSeriesConfig: [...seriesConfigRadar1],

      //   filters: {
      //     selectedSeries: "Pnl",
      //     selectedFilter: "none",
      //     selectedSort: "none",
      //     value: "",
      //     from: "",
      //     to: "",
      //   },
      // },

      "radial-bar-chart-1": {
        originalSeries: [...radialData],
        filteredSeries: [...radialData],
        xLabelsKey: "Date",

        tempLayout: { ...defaultLayoutRadial1 },
        layout: { ...defaultLayoutRadial1 },

        seriesConfig: [...seriesConfigRadial1],
        tempSeriesConfig: [...seriesConfigRadial1],

        filters: {
          selectedSeries: "Completion",
          selectedFilter: "none",
          selectedSort: "none",
          value: "",
          from: "",
          to: "",
        },
      },
    },

    order: [
      { id: "radial-bar-chart-1", type: "radialBar" },
      { id: "apex-line-chart-3", type: "line" },
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

    updateChart: (chartId, callback) => {
      set((s) => {
        if (typeof chartId === "function") {
          chartId(s);
        } else callback(s.charts[chartId], s);
      });
    },
  }))
);
