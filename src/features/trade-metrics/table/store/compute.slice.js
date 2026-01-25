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
        rowOrder,
        columnsById,
        affectedMap,
        groupBy,
        groups,
      } = state;

      /* ================================
       * Helpers
       * ================================ */
      const getValue = (trade, key) => trade.cells[key]?.value ?? null;
      const setValue = (trade, schema, value) => {
        trade.cells[schema.id].value = value;
      };

      const compute = ({ sequenceIds, schema, startIndex, usePrev }) => {
        computeOverSequence({
          tradesById,
          sequenceIds,
          schema,
          getValue,
          setValue,
          startIndex,
          usePrev,
        });
      };

      const isComputed = (schema) => schema && schema.type.includes("computed");

      /* ================================
       * FULL RECOMPUTE
       * ================================ */
      if (!payload || payload.reason === "all") {
        Object.values(columnsById).forEach((schema) => {
          if (!isComputed(schema)) return;

          // Grouped
          if (schema.mode === "grouped" && groups) {
            groups.forEach((group) =>
              compute({
                schema,
                sequenceIds: group.rowIds,
                usePrev: true,
              }),
            );
            return;
          }

          // Normal / cumulative
          compute({
            schema,
            sequenceIds: rowOrder,
            usePrev: schema.mode !== "row",
          });
        });

        return;
      }

      /* ================================
       * CELL CHANGE (PARTIAL)
       * ================================ */
      if (payload.reason === "cell") {
        const { rowId, colId } = payload;

        const affectedSchemas = collectAffectedColumns(colId, affectedMap);

        affectedSchemas.forEach((schemaId) => {
          const schema = columnsById[schemaId];
          if (!isComputed(schema)) return;

          // Grouped
          if (schema.mode === "grouped" && groupBy && groups) {
            const group = groups.find((g) => g.rowIds.includes(rowId));
            if (!group) return;

            compute({
              schema,
              sequenceIds: group.rowIds,
              startIndex: group.rowIds.indexOf(rowId),
              usePrev: true,
            });

            return;
          }

          // Row-only
          if (schema.mode === "row") {
            compute({
              schema,
              sequenceIds: [rowId],
              usePrev: false,
            });
            return;
          }

          const changedIndex = rowOrder.indexOf(rowId);
          if (changedIndex === -1) return;

          // Cumulative
          compute({
            schema,
            sequenceIds: rowOrder,
            startIndex: changedIndex,
            usePrev: true,
          });
        });

        return;
      }

      /* ================================
       * COLUMN CHANGE
       * ================================ */
      if (payload.reason === "column" && payload.colId) {
        const schema = columnsById[payload.colId];
        if (!isComputed(schema)) return;

        // Grouped
        if (schema.mode === "grouped" && groups) {
          groups.forEach((group) =>
            compute({
              schema,
              sequenceIds: group.rowIds,
              usePrev: true,
            }),
          );
          return;
        }

        // Normal
        compute({
          schema,
          sequenceIds: rowOrder,
          usePrev: schema.mode !== "row",
        });
      }
    });
  },
});
