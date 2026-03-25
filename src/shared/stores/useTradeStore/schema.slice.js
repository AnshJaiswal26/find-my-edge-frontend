import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";
import { createCellValue } from "@features/trade-metrics/table/model";
import { schemaService } from "@shared/services/schema.service";
import { debounce } from "lodash";

const debouncedSyncOrder = debounce(async (order, viewType, set) => {
  try {
    set({ isSaving: true });

    await schemaService.updateOrder(order, viewType);

    set({ isSaving: false });
  } catch (err) {
    set({ isSaving: false });
    console.error("Failed to sync schema order", err);
  }
}, 600);

export const createSchemaSlice = (set, get) => ({
  updateSchemaOrder(order, viewType = "DEFAULT") {
    debouncedSyncOrder(order, viewType, set);
  },

  addSchema: async (metric) => {
    // 1. API call
    const { schema: savedSchema, recomputeResult } =
      await schemaService.create(metric);

    console.log("Created schema", savedSchema, recomputeResult);

    // 2. Update store
    set((s) => {
      s.schemasById[savedSchema.id] = savedSchema;
      s.schemasOrder.push(savedSchema.id);

      s.affectedMap = buildSchemasAffectedMap(s.schemasById, s.schemasOrder);

      // 🔥 IMPORTANT: separate layers
      s.tradesOrder.forEach((tradeId) => {
        const trade = s.tradesById[tradeId];
        if (!trade) return;

        if (savedSchema.source === SCHEMA_SOURCE.COMPUTED) {
          // 👉 computed goes to derived
          if (!s.derivedByTradeId[tradeId]) {
            s.derivedByTradeId[tradeId] = {};
          }

          s.derivedByTradeId[tradeId][savedSchema.id] = null; // placeholder
        } else {
          // 👉 raw goes to trades
          const value = createCellValue(savedSchema);
          trade[savedSchema.id] = value;
        }
      });
    });

    if (recomputeResult) {
      get().applyTradeUpdates(recomputeResult.tradeUpdates);
    }

    return { savedSchema };
  },

  updateSchema: async (id, draft) => {
    // 1. API call
    const { schema: updatedSchema, recomputeResult } =
      await schemaService.update(id, draft);

    console.log(updatedSchema);
    const prevSchema = get().schemasById[id];

    set((s) => {
      // 2. Replace schema (NOT merge)
      s.schemasById[id] = updatedSchema;

      // 3. Rebuild dependency graph
      s.affectedMap = buildSchemasAffectedMap(s.schemasById, s.schemasOrder);

      // 🔥 4. HANDLE SOURCE CHANGE (VERY IMPORTANT)
      s.tradesOrder.forEach((tradeId) => {
        const trade = s.tradesById[tradeId];

        if (!trade) return;

        // ensure derived exists
        if (!s.derivedByTradeId[tradeId]) {
          s.derivedByTradeId[tradeId] = {};
        }

        const wasComputed = prevSchema.source === SCHEMA_SOURCE.COMPUTED;
        const isComputed = updatedSchema.source === SCHEMA_SOURCE.COMPUTED;

        // RAW → COMPUTED
        if (!wasComputed && isComputed) {
          delete trade[id]; // remove from raw
          s.derivedByTradeId[tradeId][id] = null;
        }

        // COMPUTED → RAW
        else if (wasComputed && !isComputed) {
          delete s.derivedByTradeId[tradeId][id];

          const value = createCellValue(updatedSchema);
          trade[id] = value;
        }

        // SAME TYPE → do nothing (value stays)
      });
    });

    if (recomputeResult) {
      get().applyTradeUpdates(recomputeResult.tradeUpdates);
    }

    // 5. Recompute if computed
    // if (updatedSchema.source === SCHEMA_SOURCE.COMPUTED) {
    //   get().recompute({
    //     reason: "schema",
    //     schemaId: id,
    //   });
    // }

    return { updatedSchema };
  },

  deleteSchema: async (id) => {
    // 1. API call
    await schemaService.delete(id);

    set((s) => {
      const schema = s.schemasById[id];
      if (!schema) return;

      const isComputed = schema.source === SCHEMA_SOURCE.COMPUTED;

      // 2. Remove schema
      delete s.schemasById[id];
      s.schemasOrder = s.schemasOrder.filter((schemaId) => schemaId !== id);

      // 3. Remove values from trades
      s.tradesOrder.forEach((tradeId) => {
        const trade = s.tradesById[tradeId];

        if (!trade) return;

        if (isComputed) {
          delete s.derivedByTradeId[tradeId]?.[id];
        } else {
          delete trade[id];
        }
      });

      // 4. Rebuild dependency graph
      s.affectedMap = buildSchemasAffectedMap(s.schemasById, s.schemasOrder);
    });

    return { id };
  },
});
