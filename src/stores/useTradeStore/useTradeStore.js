import { tradeData } from "@data";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { schemaApi } from "@lib/api/schema.api";
import { columnsById } from "@table/data";
import { formatForInput, parseInputValue } from "@utils";
import { useUIStore } from "@stores";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { tradeApi } from "@lib/api/trade.api";
import { debounce } from "lodash";

export const useTradeStore = create(
  immer((set, get) => ({
    tradesById: {},
    computedById: {},
    tradeOrder: [],
    isLoading: false,

    schemasById: {},
    schemaOrder: [],

    pendingUpdates: {}, // { tradeId: { col: value } }
    isSaving: false,

    /* ---------------- FETCH ALL ---------------- */

    async fetchAll() {
      set({ isLoading: true });

      try {
        /* ---------------- 1. FETCH SCHEMAS ---------------- */

        const schemaRes = await schemaApi.getAll();
        // already parsed + returns data

        const schemasById = schemaRes.schemasById || {};
        const schemaOrder = schemaRes.order || [];

        // store schemas first
        set({ schemasById, schemaOrder });

        /* ---------------- 2. FETCH TRADES ---------------- */

        const trades = await tradeApi.getAll();

        console.log(trades);
        //  already parsed

        const tradesById = {};
        const tradeOrder = [];

        trades.forEach((t) => {
          const id = t.id || crypto.randomUUID();
          const trade = {};

          schemaOrder.forEach((schemaId) => {
            const schema = schemasById[schemaId];

            if (!schema) return;

            // skip computed
            if (schema.source !== SCHEMA_SOURCE.COMPUTED) {
              trade[schema.id] = parseInputValue(
                t[schema.id],
                schema.semanticType,
              );
            }
          });

          tradesById[id] = { id, ...trade };
          tradeOrder.push(id);
        });

        set({ tradesById, tradeOrder, isLoading: false });
      } catch (err) {
        useUIStore.getState().showToast("ERROR", err.message);
        set({ isLoading: false });
      }
    },

    addTrade(trade, id) {
      set((s) => {
        s.tradesById[id] = { id, ...trade };
        s.tradeOrder.push(id);
      });
    },

    updateTrade(id, patch) {
      set((s) => {
        Object.assign(s.tradesById[id], patch);
      });
    },

    deleteTrade(id) {
      set((s) => {
        delete s.tradesById[id];
        s.tradeOrder = s.tradeOrder.filter((x) => x !== id);
      });
    },

    queueTradeUpdate: (id, patch) => {
      set((s) => {
        if (!s.pendingUpdates[id]) {
          s.pendingUpdates[id] = {};
        }
        Object.assign(s.pendingUpdates[id], patch);
      });

      get().debouncedSync(); // trigger background sync
    },

    debouncedSync: debounce(async () => {
      const { pendingUpdates, tradesById, schemasById } = get();

      if (!Object.keys(pendingUpdates).length) return;

      set({ isSaving: true });

      try {
        const updates = { ...pendingUpdates };

        // clear queue optimistically
        set({ pendingUpdates: {} });

        await Promise.all(
          Object.keys(updates).map((id) => {
            const trade = tradesById[id];

            // 🔥 filter ONLY non-computed fields
            const cleanTrade = {};

            Object.keys(trade).forEach((key) => {
              if (key === "id") return;

              const schema = schemasById[key];

              if (schema?.source !== SCHEMA_SOURCE.COMPUTED) {
                cleanTrade[key] = formatForInput(
                  trade[key],
                  schema.semanticType,
                );
              }
            });

            return tradeApi.update(id, cleanTrade); // full object
          }),
        );
      } catch (err) {
        useUIStore.getState().showToast("ERROR", err.message);
      } finally {
        set({ isSaving: false });
      }
    }, 800),
    // debounce like Google Sheets

    updateSchemaOrder(order) {
      set((s) => {
        s.schemaOrder = order;
      });
    },

    addSchema(schema, order) {
      set((s) => {
        s.schemasById[schema.id] = schema;
        s.schemaOrder = order;
      });
    },

    updateSchema(id, draft, order) {
      set((s) => {
        Object.assign(s.schemasById[id], draft);
      });
    },

    deleteSchema(id) {
      set((s) => {
        delete s.schemasById[id];
        s.schemaOrder = s.schemaOrder.filter((x) => x !== id);
      });
    },
  })),
);
