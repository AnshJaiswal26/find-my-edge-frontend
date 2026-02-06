import { createCell, createRow } from "../model";
import { buildAffectedMap } from "../dependency";
import { useTradeStore } from "@stores";

export const createCoreSlice = (set, get) => ({
  rowsById: {},
  rowOrder: [],

  columnsById: {},
  columnOrder: [],
  columnWidths: {},
  affectedMap: {},

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

  addColumn(metric) {
    const state = get();
    console.log(metric);

    set((s) => {
      s.columnsById[metric.id] = metric;
      s.columnOrder.push(metric.id);

      s.affectedMap = buildAffectedMap(s.columnsById, s.columnOrder);

      s.rowOrder.forEach((rowId) => {
        const row = s.rowsById[rowId];
        if (!row) return;

        const { value } = createCell(metric);
        row.cells[metric.id] = { value, meta: {} };
      });
    });

    useTradeStore.getState().addSchema(metric);

    if (metric.type.includes("computed")) {
      state.recompute({
        reason: "column",
        colId: metric.id,
      });
    }

    state.closePopup();
  },

  deleteColumn(colId) {
    if (!colId) return;

    set((s) => {
      s.columnOrder = s.columnOrder.filter((id) => id !== colId);
      s.rowOrder.forEach((id) => delete s.rowsById[id].cells[colId]);

      delete s.columnsById[colId];
      s.selectedColumn = null;
      delete s.affectedMap[colId];
      delete s.columnWidths[colId];
    });

    useTradeStore.getState().deleteSchema(colId);

    get().closePopup();
  },

  updateColumn(colId, draft) {
    const state = get();
    // console.log(draft);

    set((s) => {
      Object.assign(s.columnsById[colId], draft);
      s.affectedMap = buildAffectedMap(s.columnsById, s.columnOrder);
    });

    useTradeStore.getState().updateSchema(colId, draft);

    state.recompute({ reason: "column", colId });

    state.closePopup();
  },
});
