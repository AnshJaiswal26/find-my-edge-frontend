import { useTradeStore } from "@stores";
import {
  COMPUTATION_MODE,
  computeOverSequence,
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
      schemaOrder,
    } = useTradeStore.getState();

    const { derivedViewByTradeId, sortedRowOrder, filteredRowOrder, groups } =
      get();

    const sequence = sortedRowOrder.length
      ? sortedRowOrder
      : filteredRowOrder.length
        ? filteredRowOrder
        : tradeOder;

    const getValue = (trade, key) => {
      return (
        derivedViewByTradeId?.[trade.id]?.[key] ??
        derivedByTradeId?.[trade.id]?.[key] ??
        tradesById?.[trade.id]?.[key] ??
        null
      );
    };

    const setValue = (trade, schema, value) => {
      if (!viewValues[trade.id]) {
        viewValues[trade.id] = {};
      }
      viewValues[trade.id][schema.id] = value;
    };

    const compute = ({ sequenceIds, schema, startIndex = 0 }) => {
      computeOverSequence({
        schema,
        getTradeAt: (index) => {
          if (index < 0) return null;
          const id = sequenceIds[index];
          return id ? tradesById[id] : null;
        },
        getTradeCount: () => sequenceIds.length,
        getSchemaType: (key) => {
          const col = schemasById[key];
          return { format: col?.display?.format, type: col.semanticType };
        },
        getValue,
        setValue,
        startIndex,
        mode: COMPUTATION_MODE.WINDOW,
      });
    };

    schemaOrder.forEach((id) => {
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
