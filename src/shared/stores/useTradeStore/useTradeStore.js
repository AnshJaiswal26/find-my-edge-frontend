import { useUIStore } from "@shared/stores";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { createComputeSlice } from "./compute.slice";
import { createTradeSlice } from "./trade.slice";
import { createSchemaSlice } from "./schema.slice";

import { useDashboardStore } from "@features/dashboard/store";
import { useTableStore } from "@features/trade-metrics/table/store";

import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";
import { tradeService } from "@lib/services/trade.service";
import { schemaService } from "@lib/services/schema.service";
import { bootstrapService } from "@features/bootstrap/services/bootstrap.service";

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

    isInitialized: false,
    isInitializing: false,

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
        const [schemasRes, trades] = await Promise.all([
          schemaService.getAll(),
          tradeService.getAll(),
        ]);

        console.log(schemasRes, trades);

        const { schemasById, schemasOrder } = schemasRes;

        const { tradesById, derivedByTradeId, tradesOrder } =
          tradeService.parse(trades, schemasById, schemasOrder);
        /* ---------------- 1. FETCH SCHEMAS ---------------- */

        const affectedMap = buildSchemasAffectedMap(schemasById, schemasOrder);

        set({
          tradesById,
          derivedByTradeId,
          tradesOrder,
          schemasById,
          schemasOrder,
          affectedMap,
          isLoading: false,
        });

        get().recompute({ reason: "all" });

        // console.log(get().derivedByTradeId);

        useTableStore.getState().hydrateSchema();
        useDashboardStore.getState().loadInitialCharts();
      } catch (err) {
        console.error(err);
        useUIStore.getState().showToast("ERROR", err.message);
        set({ isLoading: false });
      }
    },

    async init() {
      if (get().isInitialized || get().isInitializing) return;

      try {
        set({ isInitializing: true });

        const data = await bootstrapService.init();

        set({
          tradesById: data.tradesById,
          derivedByTradeId: data.derivedByTradeId,
          tradesOrder: data.tradesOrder,

          schemasById: data.schemasById,
          schemasOrder: data.schemasOrder,

          isInitialized: true,
          isInitializing: false,
        });
      } catch (error) {
        console.error("Bootstrap init failed:", error);
      } finally {
        set({ isInitializing: false });
      }
    },
  })),
);
