import { tradeData } from "@data";
import { create } from "zustand";

const series = tradeData.map((trade, i) => ({
  ...trade,
  "Risk/Reward": trade.risk ? +(trade.pnl / trade.risk).toFixed(2) : 0,
  Risk: trade.risk ? +((trade.pnl / trade.risk) * 1.5).toFixed(2) : 0,
  trade: `Trade ${i + 1}`,
}));

const labelsKeys = "date";

export const useChartStore = create((set) => ({
  charts: {
    "apex-line-chart-1": {
      originalSeries: series,
      filteredSeries: series,
      labelsKey: labelsKeys,

      layout: {
        title: "P&L Booked on Risk/Reward",
        labelsKey: labelsKeys,
        wrapperWidth: "100%",
        chartWidth: 100,

        dimensions: 100,

        // grid
        gridEnabled: true,
        xGrid: false,
        yGrid: true,

        // bar
        horizontal: false,

        stacked: true,
        stacked100: false,
        barRadius: 1,

        // xaxis
        xTooltip: true,
        xLabels: false,
        xLabelsColor: "var(--apexcharts-axis-labels-color)",
        xTitleText: "Trades",
        xTitleColor: "var(--apexcharts-axis-labels-color)",
        xLabelSeries: series.map((d) => d[labelsKeys]),
        xLabelPrefix: "Trade",
        xLabelIndex: true,

        //yaxis
        yTooltip: false,
        yLabels: false,
        yLabelsColor: "var(--apexcharts-axis-labels-color)",
        yTitleText: "Risk/Reward",
        yTitleColor: "var(--apexcharts-axis-labels-color)",
        yLabelPrefix: "1:",

        tooltip: true,
        dataLabels: false,
      },

      seriesConfig: [
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
      ],

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
  },

  order: [],

  // --- Meta (general chart info)
  updateMeta: (chartId, meta) => {
    set((state) => ({
      charts: {
        ...state.charts, // new root charts object
        [chartId]: {
          ...state.charts[chartId], // new chart object
          ...meta, // update meta properties
        },
      },
    }));
  },

  // --- Layout
  updateLayout: (chartId, layoutUpdates) => {
    set((state) => ({
      charts: {
        ...state.charts, // new root charts object
        [chartId]: {
          ...state.charts[chartId], // new chart object
          layout: {
            ...state.charts[chartId].layout,
            ...layoutUpdates, // updated layout
          },
        },
      },
    }));
  },

  // --- Filters
  updateFilters: (chartId, filterUpdates) => {
    set((state) => ({
      charts: {
        ...state.charts, // new root object
        [chartId]: {
          ...state.charts[chartId], // new chart object
          filters: {
            ...state.charts[chartId].filters,
            ...filterUpdates, // updated filters
          },
        },
      },
    }));
  },

  // --- Series
  updateSeries: (chartId, series) => {
    set((state) => ({
      charts: {
        ...state.charts, // new root charts object
        [chartId]: {
          ...state.charts[chartId], // new chart object
          filteredSeries: series, // updated series
        },
      },
    }));
  },

  // --- Reset Series
  resetSeries: (chartId) => {
    set((state) => ({
      charts: {
        ...state.charts, // new reference for root charts object
        [chartId]: {
          ...state.charts[chartId], // new reference for this chart
          filteredSeries: state.charts[chartId].originalSeries, // updated series
        },
      },
    }));
  },
}));
