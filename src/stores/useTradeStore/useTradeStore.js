import { parseInputValue } from "@utils";

import { useUIStore } from "@stores";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createComputeSlice } from "./compute.slice";
import { createTradeSlice } from "./trade.slice";

import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";
import { tradeApi } from "@lib/api/trade.api";
import { schemaApi } from "@lib/api/schema.api";

import { createSchemaSlice } from "./schema.slice";
import { useDashboardStore } from "@features/dashboard/store/useDashboardStore";

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

        const schemaRes = await schemaApi.getAll();
        // already parsed + returns data

        const schemasById = schemaRes.schemasById || {};
        const schemasOrder = schemaRes.order || [];
        const affectedMap = buildSchemasAffectedMap(schemasById, schemasOrder);

        // store schemas first
        set({ schemasById, schemasOrder, affectedMap });

        /* ---------------- 2. FETCH TRADES ---------------- */

        const trades = await tradeApi.getAll();

        //  already parsed

        const tradesById = {};
        const derivedByTradeId = {};
        const tradesOrder = [];

        trades.forEach((t) => {
          const id = t.id || crypto.randomUUID();
          const trade = {};
          const derived = {};

          schemasOrder.forEach((schemaId) => {
            const schema = schemasById[schemaId];
            if (!schema) return;

            if (schema.source !== SCHEMA_SOURCE.COMPUTED) {
              trade[schema.id] = parseInputValue(
                t[schema.id],
                schema.semanticType,
              );
            } else {
              //  computed placeholder
              derived[schema.id] = null;
            }
          });

          tradesById[id] = { id, ...trade };
          derivedByTradeId[id] = derived;

          tradesOrder.push(id);
        });

        set({ tradesById, derivedByTradeId, tradesOrder, isLoading: false });

        get().recompute({ reason: "all" });

        useDashboardStore.getState().loadInitialCharts();
      } catch (err) {
        console.error(err);
        useUIStore.getState().showToast("ERROR", err.message);
        set({ isLoading: false });
      }
    },
  })),
);
