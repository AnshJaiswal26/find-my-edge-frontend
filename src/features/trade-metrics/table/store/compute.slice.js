import { useTradeStore } from "@shared/stores";
import {
  COMPUTATION_MODE,
  computeRowSequence,
} from "@lib/analytics/engine/execute";

export const createComputeSlice = (set, get) => ({
  derivedViewByTradeId: {},

  /* ------------------------------------------------------- */
  /*              CELL AND RECOMPUTE ACTIONS                 */
  /* ------------------------------------------------------- */

  recomputeView() {
    const viewValues = {};

    const {
      tradesById,
      derivedByTradeId,
      tradeOder,
      schemasById,
      schemasOrder,
    } = useTradeStore.getState();

    const { derivedViewByTradeId, sortedRowOrder, filteredRowOrder, groups } =
      get();

    const sequence = sortedRowOrder.length
      ? sortedRowOrder
      : filteredRowOrder.length
        ? filteredRowOrder
        : tradeOder;

    let seqIds = [];

    const getTradeValue = (index, key) => {
      if (index < 0) return null;
      const id = seqIds[index];

      if (!id) return null;

      return (
        derivedViewByTradeId?.[id]?.[key] ??
        derivedByTradeId?.[id]?.[key] ??
        tradesById?.[id]?.[key]
      );
    };

    const setTradeValue = (index, schemaId, value) => {
      if (index < 0) return null;
      const id = seqIds[index];

      if (!id) return null;

      if (!viewValues[id]) {
        viewValues[id] = {};
      }
      viewValues[id][schemaId] = value;
    };

    const getSchemaType = (key) => {
      const col = schemasById[key];
      return { format: col?.display?.format, type: col.semanticType };
    };

    const getTradeCount = () => seqIds.length;

    const compute = ({ sequenceIds, schema, startIndex = 0 }) => {
      seqIds = sequenceIds;

      computeRowSequence({
        ast: schema.ast,
        schemaKey: schema.id,
        initialValue: schema.initialValue,
        getTradeCount,
        getTradeValue,
        setTradeValue,
        getSchemaType,
        startIndex,
        mode: COMPUTATION_MODE.WINDOW,
      });
    };

    schemasOrder.forEach((id) => {
      const schema = schemasById[id];

      if (schema.computationMode !== "window") return;

      // 🔥 grouped view (optional)
      if (groups) {
        groups.forEach((group) =>
          compute({
            schema,
            sequenceIds: group.tradeIds,
          }),
        );
        return;
      }

      // 🔥 normal view
      compute({
        schema,
        sequenceIds: sequence,
      });
    });

    // store in tableStore
    set((state) => {
      state.derivedViewByTradeId = viewValues;
    });
  },
});
