import { generateCharts, parseInputValue } from "@utils";
import { DEFAULT_CHARTS } from "@data";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createFilterSlice } from "./filter.slice";
import { createSortSlice } from "./sort.slice";
import { createGroupSlice } from "./group.slice";
import { createLayoutSlice } from "./layout.slice";
import { createSeriesSlice } from "./series.slice";
import { createCoreSlice } from "./core.slice";
import { createPopupSlice } from "./popup.slice";
import { useTradeStore } from "@stores";

export const useChartStore = create(
  immer((set, get) => ({
    chartGridLayout: null,
    activeChart: { id: "", type: "", activePopup: null },

    // ...generateCharts(DEFAULT_CHARTS),

    order: [
      // { id: "apex-radial-bar-chart-1", type: "radialBar", category: "group" },
      // { id: "apex-pie-chart-1", type: "donut", category: "group" },
      // { id: "apex-radar-chart-1", type: "radar", category: "group" },
      // { id: "apex-polarArea-chart-1", type: "polarArea", category: "group" },
      // { id: "apex-line-chart-3", type: "line", category: "series" },
      // { id: "apex-bar-chart-1", type: "bar", category: "series" },
      // // { id: "apex-bar-chart-2", type: "bar", category: "series" },
      // { id: "apex-line-chart-1", type: "line", category: "series" },
      // { id: "apex-line-chart-2", type: "line", category: "series" },
    ],

    ...createCoreSlice(set, get),
    ...createPopupSlice(set, get),
    ...createFilterSlice(set, get),
    ...createSortSlice(set, get),
    ...createGroupSlice(set, get),
    ...createLayoutSlice(set, get),
    ...createSeriesSlice(set, get),

    hydrateFromTrades() {
      const { tradesById, tradeOrder } = useTradeStore.getState();

      if (!tradeOrder.length) return;

      const seriesOrder = [];
      const seriesById = {};

      tradeOrder.forEach((tradeId) => {
        const trade = tradesById[tradeId];

        seriesOrder.push(tradeId);

        seriesById[tradeId] = {
          id: tradeId,
          date: parseInputValue(trade.date, "date"),
          entryTime: parseInputValue(trade.entryTime, "time"),
          exitTime: parseInputValue(trade.exitTime, "time"),
          duration: parseInputValue(trade.duration, "duration"),
          symbol: parseInputValue(trade.symbol, "text"),
          entry: parseInputValue(trade.entry, "number"),
          exit: parseInputValue(trade.exit, "number"),
          qty: parseInputValue(trade.qty, "number"),
          riskReward: trade.riskReward,
          capital: trade.capital,
          profit: trade.profit,
          loss: trade.loss,
          pnl: trade.pnl,
          cumulativePnl: trade.cumulativePnl,
        };
      });

      set({ seriesById, seriesOrder });
    },

    updateChart: (chartId, callback) => {
      set((s) => {
        if (typeof chartId === "function") {
          chartId(s);
        } else callback(s[chartId], s);
      });
    },
  })),
);
