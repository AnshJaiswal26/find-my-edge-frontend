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

export const useTradeStore = create(
  immer((set, get) => ({
    tradesById: {},
    derivedByTradeId: {},
    tradeOrder: [],

    isLoading: false,

    schemasById: {},
    schemaOrder: [],

    affectedMap: {},

    pendingUpdates: {},
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
        tradeOrder: [],
      });

      try {
        /* ---------------- 1. FETCH SCHEMAS ---------------- */

        const schemaRes = await schemaApi.getAll();
        // already parsed + returns data

        const schemasById = schemaRes.schemasById || {};
        const schemaOrder = schemaRes.order || [];
        const affectedMap = buildSchemasAffectedMap(schemasById, schemaOrder);

        // store schemas first
        set({ schemasById, schemaOrder, affectedMap });

        /* ---------------- 2. FETCH TRADES ---------------- */

        const trades = await tradeApi.getAll();

        //  already parsed

        const tradesById = {};
        const derivedByTradeId = {};
        const tradeOrder = [];

        trades.forEach((t) => {
          const id = t.id || crypto.randomUUID();
          const trade = {};
          const derived = {};

          schemaOrder.forEach((schemaId) => {
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

          tradeOrder.push(id);
        });

        set({ tradesById, derivedByTradeId, tradeOrder, isLoading: false });

        get().recompute({ reason: "all" });
      } catch (err) {
        useUIStore.getState().showToast("ERROR", err.message);
        set({ isLoading: false });
      }
    },
  })),
);
