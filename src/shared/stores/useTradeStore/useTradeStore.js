import { useUIStore } from "@shared/stores";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createComputeSlice } from "./compute.slice";
import { createTradeSlice } from "./trade.slice";

import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";

import { createSchemaSlice } from "./schema.slice";
import { useDashboardStore } from "@features/dashboard/store";
import { useTableStore } from "@features/trade-metrics/table/store";
import { tradeService } from "@lib/services/trade.service";
import { schemaService } from "@lib/services/schema.service";

export const useTradeStore = create(
  immer((set, get) => ({
    tradesById: {},
    derivedByTradeId: {},
    tradesOrder: [],

    isLoading: false,

    schemasById: {},
    schemasOrder: [],

    affectedMap: {},

    isSaving: false,

    ...createComputeSlice(set, get),
    ...createTradeSlice(set, get),
    ...createSchemaSlice(set, get),

    /* ---------------- FETCH ALL ---------------- */

    async fetchAll() {
      set({ isLoading: true });

      set({
        tradesById: {},
        derivedByTradeId: {},
        tradesOrder: [],
      });

      try {
        /* ---------------- 1. FETCH SCHEMAS ---------------- */

        const { schemasById, order: schemasOrder } =
          await schemaService.getAll();

        const affectedMap = buildSchemasAffectedMap(schemasById, schemasOrder);

        set({ schemasById, schemasOrder, affectedMap });

        /* ---------------- 2. FETCH TRADES ---------------- */

        const { tradesById, derivedByTradeId, tradesOrder } =
          await tradeService.getAll(schemasById, schemasOrder);

        set({
          tradesById,
          derivedByTradeId,
          tradesOrder,
          isLoading: false,
        });

        get().recompute({ reason: "all" });

        useTableStore.getState().hydrateSchema();
        useDashboardStore.getState().loadInitialCharts();
      } catch (err) {
        console.error(err);
        useUIStore.getState().showToast("ERROR", err.message);
        set({ isLoading: false });
      }
    },
  })),
);
