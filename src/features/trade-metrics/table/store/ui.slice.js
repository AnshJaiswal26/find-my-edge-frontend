import { useTradeStore } from "@shared/stores";
import { debounce } from "lodash";

import { tradeMetricService } from "../service/tradeMetric.service";
import { moveItem } from "@shared/utils";

const debouncedWidthSync = debounce(async (columnId, width, set) => {
  try {
    set({ isSavingLayout: true });

    await tradeMetricService.updateColumnWidth(columnId, width);
  } catch (e) {
    console.error("Width sync failed", e);
  } finally {
    set({ isSavingLayout: false });
  }
}, 400);

export const createUiSlice = (set, get) => ({
  /* ---------------------------------------------------------------------- */
  /*                        DRAG & RESIZE                                   */
  /* ---------------------------------------------------------------------- */

  draggingColumn: null,
  colDragMode: null,
  colDragOverIndex: null,

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
        const toIndex = payload.index;

        if (
          typeof fromIndex === "number" &&
          typeof toIndex === "number" &&
          fromIndex !== toIndex
        ) {
          const newOrder = moveItem(
            s.columnsOrder,
            fromIndex,
            s.groupBy && toIndex === 0 ? 1 : toIndex,
          );
          s.columnsOrder = newOrder;
          useTradeStore.getState().updateSchemaOrder(newOrder, "TABLE");
        }
      }

      /* ---------- RESIZE ---------- */
      if (s.colDragMode === "resize") {
        if (payload?.width != null) {
          s.columnWidths[s.draggingColumn.id] = payload.width;
          debouncedWidthSync(s.draggingColumn.id, payload.width, set);
        }
      }

      /* ---------- CLEANUP ---------- */
      s.draggingColumn = null;
      s.colDragMode = null;
      s.colDragOverIndex = null;
    });
  },

  /* ---------------------------------------------------------------------- */
  /*                             SELECTION                                  */
  /* ---------------------------------------------------------------------- */

  selectedColumn: null,
  selectedRow: null,

  selectColumn(payload) {
    set({
      selectedColumn: {
        id: payload.id,
        width: payload.width,
        left: payload.left,
      },
      colDragMode: "select",
    });
  },

  unselectColumn(payload) {
    if (payload?.id === get().selectedColumn?.id) return;
    set({ selectedColumn: null, colDragMode: null });
  },

  /* ---------------------------------------------------------------------- */
  /*                             POPUP                                      */
  /* ---------------------------------------------------------------------- */

  activePopup: null,

  openPopup(id) {
    set({ activePopup: id });
  },

  closePopup() {
    set({ activePopup: null });
  },
});
