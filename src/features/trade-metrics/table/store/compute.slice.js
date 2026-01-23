import { useTradeStore } from "@stores";
import { collectAffectedColumns } from "../dependency";
import { computeOverSequence } from "@lib/analytics/engine/execute";

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

    if (state.affectedMap?.[column.id]) {
      state.recompute({
        reason: "cell",
        rowId,
        colId,
        groupId,
      });
    }

    useTradeStore.getState().updateTrade(rowId, {
      [colId]: value,
    });
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

      /* =====================================
       * FULL RECOMPUTE
       * ===================================== */
      if (!payload || payload.reason === "all") {
        Object.values(columnsById).forEach((schema) => {
          if (!schema.type.includes("computed")) return;

          if (schema.mode === "grouped" && groups) {
            groups.forEach((group) => {
              computeOverSequence({
                tradesById,
                sequenceIds: group.rowIds,
                schema,
                getValue,
                setValue,
                usePrev: true,
              });
            });
            return;
          }

          computeOverSequence({
            tradesById,
            sequenceIds: tradeOrder,
            schema,
            getValue,
            setValue,
            usePrev: schema.mode !== "row",
          });
        });
        return;
      }

      /* =====================================
       * CELL CHANGE (PARTIAL)
       * ===================================== */
      if (payload.reason === "cell") {
        const { rowId, colId } = payload;

        const changedIndex = tradeOrder.indexOf(rowId);
        if (changedIndex === -1) return;

        const affectedSchemas = collectAffectedColumns(colId, affectedMap);

        affectedSchemas.forEach((schemaId) => {
          const schema = columnsById[schemaId];
          if (!schema || !schema.type.includes("computed")) return;

          // ---------- GROUPED ----------
          if (schema.mode === "grouped" && groupBy && groups) {
            const group = groups.find((g) => g.rowIds.includes(rowId));
            if (!group) return;

            const groupIndex = group.rowIds.indexOf(rowId);

            computeOverSequence({
              tradesById,
              sequenceIds: group.rowIds,
              schema,
              getValue,
              setValue,
              startIndex: groupIndex,
              usePrev: true,
            });

            return;
          }

          // ---------- ROW ----------
          if (schema.mode === "row") {
            computeOverSequence({
              tradesById,
              sequenceIds: [rowId], // ✅ single-trade sequence
              schema,
              getValue,
              setValue,
              usePrev: false,
            });
            return;
          }

          // ---------- CUMULATIVE ----------
          computeOverSequence({
            tradesById,
            sequenceIds: tradeOrder,
            schema,
            getValue,
            setValue,
            startIndex: changedIndex,
            usePrev: true,
          });
        });

        return;
      }

      /* =====================================
       * COLUMN CHANGE
       * ===================================== */
      if (payload.reason === "column" && payload.colId) {
        const schema = columnsById[payload.colId];
        if (!schema || !schema.type.includes("computed")) return;

        if (schema.mode === "grouped" && groups) {
          groups.forEach((group) => {
            computeOverSequence({
              tradesById,
              sequenceIds: group.rowIds,
              schema,
              getValue,
              setValue,
              usePrev: true,
            });
          });
          return;
        }

        computeOverSequence({
          tradesById,
          sequenceIds: tradeOrder,
          schema,
          getValue,
          setValue,
          usePrev: schema.mode !== "row",
        });
      }
    });
  },
});
