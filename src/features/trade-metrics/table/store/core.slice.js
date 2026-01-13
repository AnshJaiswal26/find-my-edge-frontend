import { tradeData } from "@data";
import { columnsById } from "../data";
import { createCell, createRow } from "../model";
import { buildAffectedMap } from "../dependency";
import { parseInputValue } from "../engine/execute";

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

    Array.from({ length: 1 }).forEach(() => {
      tradeData.forEach((t) => {
        const trade = createRow(state.columnsById);

        trade.cells.date.value = parseInputValue(t.Date, "date");
        trade.cells.entryTime.value = parseInputValue(t["Entry Time"], "time");
        trade.cells.exitTime.value = parseInputValue(t["Exit Time"], "time");
        trade.cells.duration.value = parseInputValue(t.Duration, "duration");
        trade.cells.symbol.value = parseInputValue(t.Symbol, "text");
        trade.cells.entry.value = parseInputValue(t.Entry, "number");
        trade.cells.exit.value = parseInputValue(t.Exit, "number");
        trade.cells.qty.value = parseInputValue(t.Qty, "number");
        trade.cells.sl.value = parseInputValue(t.SL, "number");

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

    get().closePopup();
  },

  updateColumn(activeColId, draft) {
    const state = get();
    set((s) => {
      Object.assign(s.columnsById[activeColId], draft);
      s.affectedMap = buildAffectedMap(s.columnsById);
    });

    if (draft.type.includes("computed"))
      state.recompute({ reason: "column", colId: activeColId });

    state.closePopup();
  },
});
