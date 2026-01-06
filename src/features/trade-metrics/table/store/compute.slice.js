import { collectAffectedColumns } from "../dependency";
import { computeColumn, PARTIAL_RUNNERS } from "../engine/execute";
import { getRowIndex } from "../utils";

export const createComputeSlice = (set, get) => ({
  /* ------------------------------------------------------------- */
  /*                    CELL AND RECOMPUTE ACTIONS                 */
  /* ------------------------------------------------------------- */

  updateCell(rowId, colId, value) {
    const state = get();
    const cell = state.rowsById[rowId].cells[colId];
    const column = state.columnsById[colId];

    if (cell.value === value) return;

    set((s) => {
      s.rowsById[rowId].cells[colId].value = value;
    });

    if (column.type === "number") {
      state.recompute({
        reason: "cell",
        rowId,
        colId,
      });
    }
  },

  recompute(payload) {
    set((state) => {
      const { rowsById, rowOrder, columnsById, affectedMap } = state;

      /* ================= FULL RECOMPUTE ================= */
      if (!payload || payload.reason === "all") {
        Object.values(columnsById).forEach((column) => {
          computeColumn(rowsById, rowOrder, column);
        });
        return;
      }

      /* ================= CELL CHANGE ================= */
      if (payload.reason === "cell" && payload.rowId && payload.colId) {
        const rowIndex = getRowIndex(rowOrder, payload.rowId);

        // 🔹 get dependency chain
        const chain = collectAffectedColumns(payload.colId, affectedMap);

        chain.forEach((colId) => {
          const column = columnsById[colId];
          if (!column || column.type !== "computed") return;

          PARTIAL_RUNNERS[column.mode](rowsById, rowOrder, rowIndex, column);
        });

        return;
      }

      /* ================= COLUMN CHANGE ================= */
      if (payload.reason === "column" && payload.colId) {
        const column = columnsById[payload.colId];
        if (!column) return;

        computeColumn(rowsById, rowOrder, column);
      }
    });
  },
});
