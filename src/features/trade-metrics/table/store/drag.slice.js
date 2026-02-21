import { useTradeStore } from "@shared/stores";
import { moveItem } from "../interaction";

export const createDragSlice = (set, get) => ({
  /* ---------------- DRAG STATE ---------------- */

  draggingColumn: null, // { id, fromIndex }
  colDragMode: null, // "reorder" | "resize"
  colDragOverIndex: null, // number | null

  /* ---------------- ACTIONS ---------------- */

  startColumnDrag({ id, index }) {
    set({
      draggingColumn: { id, fromIndex: index },
      colDragMode: "reorder",
      colDragOverIndex: index,
    });
  },

  setColDragOverIndex(index) {
    set((s) => {
      if (!s.draggingColumn) return;
      if (s.colDragOverIndex !== index) {
        s.colDragOverIndex = index;
      }
    });
  },

  startColumnResize({ id }) {
    set({
      draggingColumn: { id },
      colDragMode: "resize",
    });
  },

  endColumnDrag(payload) {
    set((s) => {
      if (!s.draggingColumn) return;

      /* ---------- REORDER ---------- */
      if (s.colDragMode === "reorder") {
        const { fromIndex } = s.draggingColumn;
        const toIndex = s.colDragOverIndex;

        if (
          typeof fromIndex === "number" &&
          typeof toIndex === "number" &&
          fromIndex !== toIndex
        ) {
          const newOrder = moveItem(
            s.columnsOrder,
            fromIndex,
            s.groupBy && toIndex == 0 ? 1 : toIndex,
          );
          s.columnsOrder = newOrder;
          useTradeStore.getState().updateSchemaOrder(newOrder);
        }
      }

      /* ---------- RESIZE ---------- */
      if (s.colDragMode === "resize") {
        if (payload?.width != null) {
          s.columnWidths[s.draggingColumn.id] = payload.width;
        }
      }

      /* ---------- CLEANUP ---------- */
      s.draggingColumn = null;
      s.colDragMode = null;
      s.colDragOverIndex = null;
    });
  },
});
