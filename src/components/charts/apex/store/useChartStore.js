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
import { computeSchema } from "@lib/analytics/engine/execute";

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

    recompute() {
      set((state) => {
        const { seriesById, seriesOrder, schemasById } = state;
        Object.values(schemasById).forEach((schema) => {
          computeSchema({
            tradesById: seriesById,
            tradeOrder: seriesOrder,
            schema,
            getValue: (trade, key) => trade[key],
            setValue: (trade, value) => {
              trade[schema.id] = value;
            },
          });
        });
      });

      get().loadInitialCharts();
    },

    hydrateSchema() {
      const { schemasById, schemaOrder } = useTradeStore.getState();
      set({ schemasById: { ...schemasById }, schemaOrder: [...schemaOrder] });
    },

    hydrateFromTrades() {
      const { hydrateSchema, recompute } = get();
      hydrateSchema();

      const { tradesById, tradeOrder } = useTradeStore.getState();

      if (!tradeOrder.length) return;

      const seriesOrder = [...tradeOrder];
      const seriesById = { ...tradesById };

      set({ seriesById, seriesOrder });

      recompute();
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
