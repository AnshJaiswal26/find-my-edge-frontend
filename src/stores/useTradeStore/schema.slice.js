import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { schemaApi } from "@lib/api/schema.api";
import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";
import { createCell } from "@table/model";

export const createSchemaSlice = (set, get) => ({
  updateSchemaOrder(order) {
    set((s) => {
      s.schemaOrder = order;
    });
  },

  addSchema: async (metric) => {
    // 1. API call
    const { schema: savedSchema, order } = await schemaApi.create(metric);

    // 2. Update store
    set((s) => {
      s.schemasById[savedSchema.id] = savedSchema;
      s.schemaOrder = order;

      s.affectedMap = buildSchemasAffectedMap(s.schemasById, s.schemaOrder);

      // 🔥 IMPORTANT: separate layers
      s.tradeOrder.forEach((tradeId) => {
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
          const { value } = createCell(savedSchema);
          trade[savedSchema.id] = value;
        }
      });
    });

    console.log(savedSchema);

    // 3. Recompute ONLY for computed
    if (savedSchema.source === SCHEMA_SOURCE.COMPUTED) {
      get().recompute({
        reason: "schema",
        schemaId: savedSchema.id,
      });
    }

    return { savedSchema };
  },

  updateSchema: async (id, draft) => {
    // 1. API call
    const { schema: updatedSchema, order } = await schemaApi.update(id, draft);

    const prevSchema = get().schemasById[id];

    set((s) => {
      // 2. Replace schema (NOT merge)
      s.schemasById[id] = updatedSchema;
      s.schemaOrder = order;

      // 3. Rebuild dependency graph
      s.affectedMap = buildSchemasAffectedMap(s.schemasById, s.schemaOrder);

      // 🔥 4. HANDLE SOURCE CHANGE (VERY IMPORTANT)
      s.tradeOrder.forEach((tradeId) => {
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

          const { value } = createCell(updatedSchema);
          trade[id] = value;
        }

        // SAME TYPE → do nothing (value stays)
      });
    });

    // 5. Recompute if computed
    if (updatedSchema.source === SCHEMA_SOURCE.COMPUTED) {
      get().recompute({
        reason: "schema",
        schemaId: id,
      });
    }

    return { updatedSchema };
  },

  deleteSchema: async (id) => {
    // 1. API call
    const { order } = await schemaApi.delete(id);

    set((s) => {
      const schema = s.schemasById[id];
      if (!schema) return;

      const isComputed = schema.source === SCHEMA_SOURCE.COMPUTED;

      // 2. Remove schema
      delete s.schemasById[id];
      s.schemaOrder = order;

      // 3. Remove values from trades
      s.tradeOrder.forEach((tradeId) => {
        const trade = s.tradesById[tradeId];

        if (!trade) return;

        if (isComputed) {
          delete s.derivedByTradeId[tradeId]?.[id];
        } else {
          delete trade[id];
        }
      });

      // 4. Rebuild dependency graph
      s.affectedMap = buildSchemasAffectedMap(s.schemasById, s.schemaOrder);
    });

    // 5. Recompute affected columns (VERY IMPORTANT 🔥)
    // get().recompute({
    //   reason: "schema_delete",
    //   schemaId: id,
    // });

    return { id };
  },
});
