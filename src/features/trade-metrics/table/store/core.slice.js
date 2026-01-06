import { tradeData } from "@data";
import { columnsById } from "../data";
import { createCell, createRow } from "../model";
import { buildAffectedMap } from "../dependency";

export const createCoreSlice = (set, get) => ({
  rowsById: {},
  rowOrder: [],

  columnsById: { ...columnsById },
  columnOrder: [],
  columnWidths: {},
  affectedMap: {},

  /* ---------------------------------------------------------------------- */
  /*                              DATA ACTIONS                              */
  /* ---------------------------------------------------------------------- */

  initDemoData() {
    set({ isDataLoading: true });
    const state = get();

    const rowOrder = [];
    const rowsById = {};

    Array.from({ length: 10 }).forEach(() => {
      tradeData.forEach((t) => {
        const trade = createRow(state.columnsById);

        trade.cells.date.value = t.Date;
        trade.cells.entryTime.value = t["Entry Time"];
        trade.cells.exitTime.value = t["Exit Time"];
        trade.cells.symbol.value = t.Symbol;
        trade.cells.entry.value = t.Entry;
        trade.cells.exit.value = t.Exit;
        trade.cells.qty.value = t.Qty;
        trade.cells.sl.value = t.SL;

        rowOrder.push(trade.id);
        rowsById[trade.id] = trade;
      });
    });

    set({
      rowsById,
      rowOrder,
      columnOrder: Object.keys(state.columnsById),
      affectedMap: buildAffectedMap(state.columnsById),
    });

    state.recompute({ reason: "all" });

    set({ isDataLoading: false });
  },

  /* ---------------------------------------------------------------------- */
  /*                              ROW ACTIONS                               */
  /* ---------------------------------------------------------------------- */

  addTrade() {
    const t = createRow(get().columnsById);
    set((s) => {
      s.rowsById[t.id] = t;
      s.rowOrder.push(t.id);
    });
  },

  /* ---------------------------------------------------------------------- */
  /*                              COLUMN ACTIONS                            */
  /* ---------------------------------------------------------------------- */

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

    get().closePopup();
  },

  updateColumn(activeColId, draft) {
    const state = get();
    set((s) => {
      Object.assign(s.columnsById[activeColId], draft);

      if (s.columnsById[activeColId]?.formula !== draft?.formula) {
        s.affectedMap = buildAffectedMap(s.columnsById);
      }
    });

    if (draft.type === "computed")
      state.recompute({ reason: "column", colId: activeColId });

    state.closePopup();
  },
});
