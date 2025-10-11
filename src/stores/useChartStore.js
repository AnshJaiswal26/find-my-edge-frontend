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
      title: "P&L Booked on Risk/Reward",
      labelsKey: labelsKeys,
      wrapperWidth: "100%",
      chartWidth: 100,

      // grid
      gridEnabled: true,
      xaxisGrid: false,
      yaxisGrid: true,

      // bar
      barHorizontal: false,

      stacked: true,
      stacked100: false,
      borderRadius: 1,

      // xaxis
      xaxisTooltip: true,
      xaxisLabels: false,
      xaxisLabelsColor: "var(--apexcharts-axis-labels-color)",
      xaxisTitleText: "Trades",
      xaxisTitleColor: "var(--apexcharts-axis-labels-color)",
      xaxisLabelSeries: series.map((d) => d[labelsKeys]),
      xaxisLabelPrefix: "Trade",
      xaxisLabelIndex: true,

      //yaxis
      yaxisTooltip: false,
      yaxisLabels: false,
      yaxisLabelsColor: "var(--apexcharts-axis-labels-color)",
      yaxisTitleText: "Risk/Reward",
      yaxisTitleColor: "var(--apexcharts-axis-labels-color)",
      yaxisLabelPrefix: "1:",

      tooltip: true,
      barColors: ["var(--color-green)"],

      colors: [],
      dataLabels: false,
      legend: true,

      seriesConfig: [
        {
          labelConditions: (v) =>
            v > 0.6
              ? "Reward Taken"
              : v <= 0.6 && v >= 0
              ? "Breakeven"
              : "Risk Taken",

          key: "Risk/Reward",
          type: "bar",
          color: ({ value }) =>
            value > 0.6
              ? "var(--color-green)"
              : value <= 0.6 && value >= 0
              ? "var(--color-yellow)"
              : "var(--color-red)",
        },
      ],

      originalSeries: series,
      filteredSeries: series,
    },
  },

  filters: {
    "apex-line-chart-1": {
      filterKey: "Risk/Reward",
      visible: false,
      selectedFilter: "none",
      selectedSort: "none",
      value: "",
      from: "",
      to: "",
    },
  },
  layouts: {
    "apex-line-chart-1": {
      wrapperWidth: "100%",
      chartWidth: 100,
    },
  },

  order: [],

  updateFilters: (chartId, newFilters) => {
    set((s) => ({
      filters: {
        ...s.filters,
        [chartId]: {
          ...s.filters[chartId],
          ...(newFilters === "reset"
            ? {
                value: "",
                from: "",
                to: "",
                selectedSort: "none",
                selectedFilter: "none",
              }
            : newFilters),
        },
      },
    }));
  },

  updateLayout: (chartId, newLayout) => {
    set((s) => ({
      layouts: {
        ...s.layouts,
        [chartId]: { ...s.layouts[chartId], ...newLayout },
      },
    }));
  },

  updateChartConfig: (chartId, updates) => {
    set((s) => {
      return {
        charts: {
          ...s.charts,
          [chartId]: { ...s.charts[chartId], ...updates },
        },
      };
    });
  },

  updateSeries: (chartId, updatedSeries) =>
    set((s) => {
      const chart = s.charts[chartId];
      const series =
        updatedSeries === "reset" ? chart.originalSeries : updatedSeries;

      return {
        charts: {
          ...s.charts,
          [chartId]: {
            ...chart,
            xaxisLabelSeries: series.map(
              (d, i) => d?.[chart.labelsKey] ?? i + 1
            ),
            filteredSeries: series,
          },
        },
      };
    }),
}));
