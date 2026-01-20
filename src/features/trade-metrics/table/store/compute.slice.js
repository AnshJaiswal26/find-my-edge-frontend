import { useTradeStore } from "@stores";
import { collectAffectedColumns } from "../dependency";
import { computeColumn, PARTIAL_RUNNERS } from "../engine/execute";
import { getRowIndex } from "../utils";

export const createComputeSlice = (set, get) => ({
  /* ------------------------------------------------------------- */
  /*                    CELL AND RECOMPUTE ACTIONS                 */
  /* ------------------------------------------------------------- */

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
  },

  recompute(payload) {
    set((state) => {
      const { rowsById, rowOrder, columnsById, affectedMap, groupBy, groups } =
        state;

      /* ================= FULL RECOMPUTE ================= */
      if (!payload || payload.reason === "all") {
        Object.values(columnsById).forEach((column) => {
          computeColumn(rowsById, rowOrder, column, groups);
        });
        return;
      }

      /* ================= GROUPED CHANGE ================= */
      if (payload?.reason === "grouped") {
        if (!groupBy || !groups) return;

        Object.values(columnsById).forEach((column) => {
          if (column.type.includes("computed") && column.mode === "grouped") {
            computeColumn(rowsById, rowOrder, column, groups);
          }
        });

        return;
      }

      /* ================= CELL CHANGE ================= */
      if (payload.reason === "cell" && payload.rowId && payload.colId) {
        const rowIndex = getRowIndex(rowOrder, payload.rowId);

        const chain = collectAffectedColumns(payload.colId, affectedMap);

        chain.forEach((colId) => {
          const column = columnsById[colId];
          if (!column || !column.type.includes("computed")) return;

          // grouped column in flat view
          if (!groupBy && column.mode === "grouped") return;

          // GROUPED PARTIAL
          if (column.mode === "grouped" && groupBy) {
            const groupId =
              payload.groupId ?? findGroupForRow(groups, payload.rowId);

            if (!groupId) return;

            const group = groups.find((g) => g.groupId === groupId);
            const groupIndex = group.rowIds.indexOf(payload.rowId);

            if (groupIndex === -1) return;

            PARTIAL_RUNNERS.grouped({
              rowsById,
              group,
              groupIndex,
              column,
            });

            return;
          }

          // ROW / CUMULATIVE
          PARTIAL_RUNNERS[column.mode]({
            rowsById,
            rowOrder,
            rowIndex,
            rowId: payload.rowId,
            column,
          });
        });

        return;
      }

      /* ================= COLUMN CHANGE ================= */
      if (payload.reason === "column" && payload.colId) {
        const column = columnsById[payload.colId];
        if (!column) return;

        computeColumn(rowsById, rowOrder, column, groups);
      }
    });
  },
});
