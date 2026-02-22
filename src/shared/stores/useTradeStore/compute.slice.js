import {
  COMPUTATION_MODE,
  computeRowSequence,
} from "@lib/analytics/engine/execute";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { collectAffectedSchemas } from "@lib/analytics/schema/dependency";

export const createComputeSlice = (set, get) => ({
  recompute(payload) {
    set((state) => {
      const {
        tradesById,
        derivedByTradeId,
        tradesOrder,
        schemasById,
        schemasOrder,
        affectedMap,
      } = state;

      /* ================================
       * Helpers
       * ================================ */

      let seqIds = [];

      const getTradeValue = (index, key) => {
        if (index < 0) return null;
        const id = seqIds[index];

        if (!id) return null;

        return derivedByTradeId?.[id]?.[key] ?? tradesById?.[id]?.[key];
      };

      const setTradeValue = (index, schemaId, value) => {
        if (index < 0) return null;
        const id = seqIds[index];
        if (!id) return null;

        if (schemasById[schemaId].source === SCHEMA_SOURCE.COMPUTED) {
          // write to derived layer
          if (!derivedByTradeId[id]) {
            derivedByTradeId[id] = {};
          }

          if (derivedByTradeId[id][schemaId] === value) return;

          derivedByTradeId[id][schemaId] = value;
        } else {
          //  write to raw layer
          if (tradesById[id][schemaId] === value) return;

          tradesById[id][schemaId] = value;
        }
      };

      const getSchemaType = (key) => {
        const schema = schemasById[key];
        return { format: schema?.display?.format, type: schema.semanticType };
      };

      const getTradeCount = () => seqIds.length;

      const compute = ({ sequenceIds, schema, startIndex = 0, mode }) => {
        seqIds = sequenceIds;

        computeRowSequence({
          ast: schema.ast,
          schemaKey: schema.id,
          initialValue: schema.initialValue,
          getTradeCount,
          getSchemaType,
          getTradeValue,
          setTradeValue,
          startIndex,
          mode,
        });
      };

      const isComputed = (schema) => schema?.source === SCHEMA_SOURCE.COMPUTED;

      /* ================================
       * FULL RECOMPUTE
       * ================================ */
      if (!payload || payload.reason === "all") {
        schemasOrder.forEach((id) => {
          const schema = schemasById[id];

          if (!isComputed(schema)) return;

          compute({
            schema,
            sequenceIds: tradesOrder,
            mode:
              schema.mode !== "row"
                ? COMPUTATION_MODE.WINDOW
                : COMPUTATION_MODE.BASE,
          });
        });
      } else if (payload.reason === "trade-delete") {
        schemasOrder.forEach((id) => {
          const schema = schemasById[id];
          if (!schema || schema?.mode !== "cumulative" || !isComputed(schema))
            return;

          compute({
            schema: schema,
            sequenceIds: tradesOrder,
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

          const changedIndex = tradesOrder.indexOf(tradeId);
          if (changedIndex === -1) return;

          // Cumulative
          compute({
            schema,
            sequenceIds: tradesOrder,
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
          sequenceIds: tradesOrder,
          mode:
            schema.mode !== "row"
              ? COMPUTATION_MODE.WINDOW
              : COMPUTATION_MODE.BASE,
        });
      }
    });
  },
});
