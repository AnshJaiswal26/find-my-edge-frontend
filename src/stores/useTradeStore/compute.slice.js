import {
  COMPUTATION_MODE,
  computeOverSequence,
} from "@lib/analytics/engine/execute";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { collectAffectedSchemas } from "@lib/analytics/schema/dependency";

export const createComputeSlice = (set, get) => ({
  recompute(payload) {
    set((state) => {
      const {
        tradesById,
        derivedByTradeId,
        tradeOrder,
        schemasById,
        schemaOrder,
        affectedMap,
      } = state;

      /* ================================
       * Helpers
       * ================================ */
      const getValue = (trade, key) => {
        return (
          derivedByTradeId?.[trade.id]?.[key] ??
          tradesById?.[trade.id]?.[key] ??
          null
        );
      };

      const setValue = (trade, schema, value) => {
        const { derivedByTradeId, tradesById } = state; // from closure

        if (schema.source === SCHEMA_SOURCE.COMPUTED) {
          // write to derived layer
          if (!derivedByTradeId[trade.id]) {
            derivedByTradeId[trade.id] = {};
          }

          if (derivedByTradeId[trade.id][schema.id] === value) return;

          derivedByTradeId[trade.id][schema.id] = value;
        } else {
          //  write to raw layer
          if (tradesById[trade.id][schema.id] === value) return;

          tradesById[trade.id][schema.id] = value;
        }
      };

      const compute = ({ sequenceIds, schema, startIndex = 0, mode }) => {
        computeOverSequence({
          schema,
          getTradeAt: (index) => {
            if (index < 0) return null;
            const id = sequenceIds[index];
            return id ? tradesById[id] : null;
          },
          getTradeCount: () => sequenceIds.length,
          getSchemaType: (key) => {
            const schema = schemasById[key];
            return {
              format: schema?.display?.format,
              type: schema.semanticType,
            };
          },
          getValue,
          setValue,
          startIndex,
          mode,
        });
      };

      const isComputed = (schema) => schema?.source === SCHEMA_SOURCE.COMPUTED;

      /* ================================
       * FULL RECOMPUTE
       * ================================ */
      if (!payload || payload.reason === "all") {
        schemaOrder.forEach((id) => {
          const schema = schemasById[id];

          if (!isComputed(schema)) return;

          compute({
            schema,
            sequenceIds: tradeOrder,
            mode:
              schema.mode !== "row"
                ? COMPUTATION_MODE.WINDOW
                : COMPUTATION_MODE.BASE,
          });
        });
      } else if (payload.reason === "trade-delete") {
        schemaOrder.forEach((id) => {
          const schema = schemasById[id];
          if (!schema || schema?.mode !== "cumulative") return;

          compute({
            schema: schema,
            sequenceIds: tradeOrder,
            startIndex: Math.max(payload.tradeIndex - 1, 0),
            mode: COMPUTATION_MODE.WINDOW,
          });
        });
      } else if (payload.reason === "value") {
        /* ================================
         * CELL CHANGE (PARTIAL)
         * ================================ */
        const { tradeId, schemaId } = payload;

        const affectedSchemas = collectAffectedSchemas(schemaId, affectedMap);

        affectedSchemas.forEach((schemaId) => {
          const schema = schemasById[schemaId];
          if (!isComputed(schema)) return;

          // Row-only
          if (schema.mode === "row") {
            compute({
              schema,
              sequenceIds: [tradeId],
              mode: COMPUTATION_MODE.BASE,
            });
            return;
          }

          const changedIndex = tradeOrder.indexOf(tradeId);
          if (changedIndex === -1) return;

          // Cumulative
          compute({
            schema,
            sequenceIds: tradeOrder,
            startIndex: changedIndex,
            mode: COMPUTATION_MODE.WINDOW,
          });
        });
      } else if (payload.reason === "schema" && payload.schemaId) {
        /* ================================
         * COLUMN CHANGE
         * ================================ */
        const schema = schemasById[payload.schemaId];
        if (!isComputed(schema)) return;

        // Normal
        compute({
          schema,
          sequenceIds: tradeOrder,
          mode:
            schema.mode !== "row"
              ? COMPUTATION_MODE.WINDOW
              : COMPUTATION_MODE.BASE,
        });
      }
    });
  },
});
