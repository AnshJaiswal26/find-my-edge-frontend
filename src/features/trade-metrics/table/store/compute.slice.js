import { useTradeStore } from "@stores";
import { collectAffectedColumns } from "../dependency";
import { computeSchema, PARTIAL_RUNNERS } from "@lib/analytics/engine/execute";

export function findGroupForRow(groups, tradeId) {
  if (!groups || !tradeId) return null;

  for (const group of groups) {
    const ids = group.rowIds;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === tradeId) return group.groupId;
    }
  }

  return null;
}

export const createComputeSlice = (set, get) => ({
  /* ------------------------------------------------------- */
  /*              CELL AND RECOMPUTE ACTIONS                 */
  /* ------------------------------------------------------- */

  updateCell(rowId, colId, value, groupId) {
    const state = get();
    const cell = state.rowsById[rowId].cells[colId];
    const column = state.columnsById[colId];

    if (cell.value === value) return;

    set((s) => {
      s.rowsById[rowId].cells[colId].value = value;
    });

    useTradeStore.getState().updateTrade(rowId, {
      [colId]: value,
    });

    if (state.affectedMap?.[column.id]) {
      state.recompute({
        reason: "cell",
        rowId,
        colId,
        groupId,
      });
    }
  },

  recompute(payload) {
    set((state) => {
      const {
        rowsById: tradesById,
        rowOrder: tradeOrder,
        columnsById,
        affectedMap,
        groupBy,
        groups,
      } = state;

      const getValue = (trade, key) => trade.cells[key]?.value ?? null;
      const setValue = (trade, schema, value) => {
        trade.cells[schema.id].value = value;
      };

      /* ================= FULL RECOMPUTE ================= */
      if (!payload || payload.reason === "all") {
        Object.values(columnsById).forEach((schema) => {
          computeSchema({
            tradesById,
            tradeOrder,
            schema,
            groups,
            getValue,
            setValue: (trade, value) => setValue(trade, schema, value),
          });
        });
        return;
      }

      /* ================= GROUPED CHANGE ================= */
      if (payload.reason === "grouped") {
        if (!groupBy || !groups) return;

        Object.values(columnsById).forEach((schema) => {
          if (schema.type.includes("computed") && schema.mode === "grouped") {
            computeSchema({
              tradesById,
              tradeOrder,
              schema,
              groups,
              getValue,
              setValue: (trade, value) => setValue(trade, schema, value),
            });
          }
        });

        return;
      }

      /* ================= CELL CHANGE ================= */
      if (payload.reason === "cell" && payload.rowId && payload.colId) {
        const changedIndex = tradeOrder.indexOf(payload.rowId);
        if (changedIndex === -1) return;

        const chain = collectAffectedColumns(payload.colId, affectedMap);

        chain.forEach((schemaId) => {
          const schema = columnsById[schemaId];
          if (!schema || !schema.type.includes("computed")) return;

          // grouped schema but not in grouped view
          if (!groupBy && schema.mode === "grouped") return;

          /* -------- GROUPED PARTIAL -------- */
          if (schema.mode === "grouped" && groupBy) {
            const groupId =
              payload.groupId ?? findGroupForRow(groups, payload.rowId);

            if (!groupId) return;

            const group = groups.find((g) => g.groupId === groupId);
            if (!group) return;

            const groupIndex = group.rowIds.indexOf(payload.rowId);
            if (groupIndex === -1) return;

            PARTIAL_RUNNERS.grouped({
              tradesById,
              tradeIds: group.rowIds,
              startIndex: groupIndex,
              schema,
              getValue,
              setValue: (trade, value) => setValue(trade, schema, value),
            });

            return;
          }

          /* -------- ROW / CUMULATIVE PARTIAL -------- */
          PARTIAL_RUNNERS[schema.mode]({
            tradesById,
            tradeOrder,
            tradeId: payload.rowId,
            startIndex: changedIndex,
            schema,
            getValue,
            setValue: (trade, value) => setValue(trade, schema, value),
          });
        });

        return;
      }

      /* ================= COLUMN CHANGE ================= */
      if (payload.reason === "column" && payload.colId) {
        const schema = columnsById[payload.colId];
        if (!schema) return;

        computeSchema({
          tradesById,
          tradeOrder,
          schema,
          groups,
          getValue,
          setValue: (trade, value) => setValue(trade, schema, value),
        });
      }
    });
  },
});
