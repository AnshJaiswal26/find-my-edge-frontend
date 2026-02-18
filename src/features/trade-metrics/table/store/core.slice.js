import { createCell, createRow } from "../model";
import { buildAffectedMap } from "../dependency";
import { useTradeStore, useUIStore } from "@stores";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { schemaApi } from "@lib/api/schema.api";

export const createCoreSlice = (set, get) => ({
  rowsById: {},
  rowOrder: [],

  columnsById: {},
  columnOrder: [],
  columnWidths: {},
  affectedMap: {},

  loading: {
    createSchema: false,
    deleteSchema: false,
  },

  /* ----------------------------------------------- */
  /*                  DATA ACTIONS                   */
  /* ----------------------------------------------- */

  /* ------------------------------------------------- */
  /*                ROW ACTIONS                        */
  /* ------------------------------------------------- */

  addRow() {
    const id = crypto.randomUUID();
    const { row, trade } = createRow(get().columnsById, id);

    set((s) => {
      s.rowsById[row.id] = row;
      s.rowOrder.push(row.id);
    });

    useTradeStore.getState().addTrade(trade, id);
  },

  deleteRow(rowId) {
    let rowIndex = 0;

    set((s) => {
      delete s.rowsById[rowId];
      s.rowOrder = s.rowOrder.filter((id, i) => {
        if (id === rowId) rowIndex = i;
        return id !== rowId;
      });

      if (s.groups) {
        s.groups.forEach((group) => {
          group.tradeIds = group.tradeIds.filter((id) => id !== rowId);
        });
      }
    });

    useTradeStore.getState().deleteTrade(rowId);

    get().recompute({ reason: "row-delete", rowIndex });
  },

  toggleHighlightRow(id) {
    set((s) => {
      s.rowsById[id].highlight = !s.rowsById[id].highlight;
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

      // 1. Call API (clean)
      const { schema: savedSchema, order } = await schemaApi.create(metric);

      console.log("Frontend", metric);
      console.log("Backend", savedSchema);

      // 2. Update column store
      set((s) => {
        s.columnsById[savedSchema.id] = savedSchema;
        s.columnOrder = order;

        s.affectedMap = buildAffectedMap(s.columnsById, s.columnOrder);

        s.rowOrder.forEach((rowId) => {
          const row = s.rowsById[rowId];
          if (!row) return;

          const { value } = createCell(savedSchema);
          row.cells[savedSchema.id] = { value, meta: {} };
        });
      });

      // 3. Update trade store
      useTradeStore.getState().addSchema(savedSchema, order);

      // 4. Recompute
      if (savedSchema.source === SCHEMA_SOURCE.COMPUTED) {
        get().recompute({
          reason: "column",
          colId: savedSchema.id,
        });
      }

      get().closePopup();

      useUIStore.getState().showToast("SUCCESS", "Column added");
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set((s) => {
        s.loading.createSchema = false;
      });
    }
  },

  deleteColumn: async (colId) => {
    if (!colId) return;

    try {
      set((s) => {
        s.loading.deleteSchema = true;
      });

      // 🔥 1. Call backend
      const { order } = await schemaApi.delete(colId);

      // 🔥 2. Update column store (use backend order)
      set((s) => {
        // remove column
        delete s.columnsById[colId];

        // update order from backend
        s.columnOrder = order;

        // remove cells
        s.rowOrder.forEach((rowId) => {
          const row = s.rowsById[rowId];
          if (!row) return;
          delete row.cells[colId];
        });

        // cleanup
        s.selectedColumn = null;
        delete s.affectedMap[colId];
        delete s.columnWidths[colId];

        // rebuild affected map (IMPORTANT 🔥)
        s.affectedMap = buildAffectedMap(s.columnsById, s.columnOrder);
      });

      // 🔥 3. Sync trade store
      useTradeStore.getState().deleteSchema(colId, order);

      get().closePopup();

      useUIStore.getState().showToast("SUCCESS", "Column deleted");
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set((s) => {
        s.loading.deleteSchema = false;
      });
    }
  },

  updateColumn: async (colId, draft) => {
    const state = get();

    try {
      set((s) => {
        s.loading.updateSchema = true;
      });

      // 🔥 1. Call backend
      const { schema: updatedSchema, order } = await schemaApi.update(
        colId,
        draft,
      );

      // 🔥 2. Update column store
      set((s) => {
        // replace with backend schema (IMPORTANT 🔥)
        s.columnsById[colId] = updatedSchema;

        // sync order (in case backend changed)
        s.columnOrder = order;

        // rebuild dependency graph
        s.affectedMap = buildAffectedMap(s.columnsById, s.columnOrder);
      });

      // 🔥 3. Sync trade store
      useTradeStore.getState().updateSchema(colId, updatedSchema, order);

      // 🔥 4. Recompute (if needed)
      if (updatedSchema.source === SCHEMA_SOURCE.COMPUTED) {
        state.recompute({
          reason: "column",
          colId,
        });
      }

      state.closePopup();

      useUIStore.getState().showToast("SUCCESS", "Column updated");
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set((s) => {
        s.loading.updateSchema = false;
      });
    }
  },
});
