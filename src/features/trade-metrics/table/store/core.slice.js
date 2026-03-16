import { useTradeStore, useUIStore } from "@shared/stores";
import { debounce } from "lodash";
import { tradeMetricService } from "../service/tradeMetric.service";

const debouncedHighlightSync = debounce(async (rowId, highlight, set) => {
  try {
    set({ isSavingLayout: true });

    await tradeMetricService.updateHighlightRow(rowId, highlight);
  } catch (e) {
    console.error("Highlight sync failed", e);
  } finally {
    set({ isSavingLayout: false });
  }
}, 400);

export const createCoreSlice = (set, get) => ({
  /* ------------------------------------------------- */
  /*                ROW ACTIONS                        */
  /* ------------------------------------------------- */

  addRow() {
    const id = crypto.randomUUID();

    useTradeStore.getState().addTrade(id);
  },

  deleteRow(rowId) {
    set((s) => {
      if (s.groups) {
        s.groups.forEach((group) => {
          group.ids = group.ids.filter((id) => id !== rowId);
        });
        if (s.highlightedRows[rowId]) delete s.highlightedRows[id];
      }
    });

    useTradeStore.getState().deleteTrade(rowId);
  },

  toggleHighlightRow(id) {
    set((s) => {
      const newValue = !s.highlightedRows[id];
      s.highlightedRows[id] = newValue;

      debouncedHighlightSync(id, newValue, set);
    });
  },

  /* ------------------------------------------------- */
  /*               COLUMN ACTIONS                      */
  /* ------------------------------------------------- */

  addColumn: async (metric) => {
    try {
      set((s) => {
        s.loading.createSchema = true;
      });

      // Call trade store (single source of truth)
      const { savedSchema } = await useTradeStore.getState().addSchema(metric);

      set((s) => {
        s.columnsOrder.push(savedSchema.id);
      });

      get().closePopup();
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set((s) => {
        s.loading.createSchema = false;
      });
    }
  },

  updateColumn: async (colId, draft) => {
    try {
      set((s) => {
        s.loading.updateSchema = true;
      });

      // 🔥 call trade store only
      await useTradeStore.getState().updateSchema(colId, draft);

      get().closePopup();

      useUIStore.getState().showToast("SUCCESS", "Column updated");
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set((s) => {
        s.loading.updateSchema = false;
      });
    }
  },

  deleteColumn: async (colId) => {
    if (!colId) return;

    try {
      set((s) => {
        s.loading.deleteSchema = true;
        s.columnsOrder = s.columnsOrder.filter((id) => id !== colId);
      });

      // 🔥 call trade store only
      await useTradeStore.getState().deleteSchema(colId);

      set((s) => {
        s.selectedColumn = null;
        delete s.columnWidths[colId];
      });

      get().closePopup();

      useUIStore.getState().showToast("SUCCESS", "Column deleted");
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
      console.error("Failed to delete column", err);
    } finally {
      set((s) => {
        s.loading.deleteSchema = false;
      });
    }
  },
});
