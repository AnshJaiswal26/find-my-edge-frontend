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

  deleteRow(id) {
    set((s) => {
      delete s.rowsById[id];
      s.rowOrder = s.rowOrder.filter((x) => x !== id);
    });

    useTradeStore.getState().deleteTrade(id);
  },

  /* ------------------------------------------------- */
  /*               COLUMN ACTIONS                      */
  /* ------------------------------------------------- */

  addColumn(metric) {
    const state = get();

    set((s) => {
      s.columnsById[metric.id] = metric;
      s.columnOrder.push(metric.id);

      const affectedMap = buildAffectedMap(s.columnsById);

      s.affectedMap = affectedMap;

      Object.values(s.rowsById).forEach((row) => {
        const { value } = createCell(metric);
        row.cells[metric.id] = { value, display: value, meta: {} };
      });
    });

    useTradeStore.getState().addSchema(metric);

    if (metric.mode === "grouped") return;

    state.recompute({
      reason: "column",
      colId: metric.id,
    });

    state.closePopup();
  },

  deleteColumn(colId) {
    if (!colId) return;

    set((s) => {
      s.columnOrder = s.columnOrder.filter((id) => id !== colId);
      Object.values(s.rowsById).forEach((row) => delete row.cells[colId]);
      delete s.columnsById[colId];
      s.selectedColumn = null;
      delete s.affectedMap[colId];
      delete s.columnWidths[colId];
    });

    useTradeStore.getState().deleteSchema(colId);

    get().closePopup();
  },

  updateColumn(activeColId, draft) {
    const state = get();
    console.log(draft);

    set((s) => {
      Object.assign(s.columnsById[activeColId], draft);
      s.affectedMap = buildAffectedMap(s.columnsById);
    });

    useTradeStore.getState().updateSchema(activeColId, draft);

    if (draft.type.includes("computed"))
      state.recompute({ reason: "column", colId: activeColId });

    state.closePopup();
  },
});
