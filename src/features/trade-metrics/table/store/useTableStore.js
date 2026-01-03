import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { filterOperationMap, sortOperationMap } from "@utils";

import { buildAffectedMap, collectAffectedColumns } from "../dependency";
import { computeColumn, PARTIAL_RUNNERS } from "../engine/execute";
import { createCell, createRow } from "../model";
import { moveItem } from "../interaction";
import { getRowIndex } from "../utils";
import { columnsById } from "../data";
import { tradeData } from "@data";

/* -------------------------------------------------------------------------- */
/*                                   STORE                                    */
/* -------------------------------------------------------------------------- */

export const useTableStore = create(
  immer((set, get) => ({
    /* ---------------------------------------------------------------------- */
    /*                                CORE STATE                              */
    /* ---------------------------------------------------------------------- */

    rowsById: {},
    rowOrder: [],

    columnsById: { ...columnsById },
    columnOrder: [],
    columnWidths: {},

    affectedMap: {},

    activePopup: null,

    /* ---------------------------------------------------------------------- */
    /*                              SELECTION STATE                           */
    /* ---------------------------------------------------------------------- */

    selectedColumn: null,
    selectedRow: null,

    /* ---------------------------------------------------------------------- */
    /*                               DRAG STATE                               */
    /* ---------------------------------------------------------------------- */

    // column drag
    draggingColumn: null,
    colDragMode: null,
    colDragX: 0,
    resizeWidth: null,
    colDragOverIndex: null,

    // row drag
    draggingRow: null,
    rowDragY: 0,
    rowDragOverIndex: null,

    /* ---------------------------------------------------------------------- */
    /*                           FILTER & SORT STATE                          */
    /* ---------------------------------------------------------------------- */

    filters: [],
    filteredRowOrder: [],

    sort: {
      columnId: null,
      operator: "none",
    },

    isDataLoading: false,

    /* ---------------------------------------------------------------------- */
    /*                             SELECTION ACTIONS                          */
    /* ---------------------------------------------------------------------- */

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
    /*                               FILTER ACTIONS                           */
    /* ---------------------------------------------------------------------- */

    addFilter() {
      set((s) => {
        s.filters.push({
          id: crypto.randomUUID(),
          columnId: Object.keys(s.columnsById)[0],
          operator: "none",
          value: "",
          value2: "",
        });
      });
    },

    updateFilter(id, patch) {
      set((s) => {
        const f = s.filters.find((f) => f.id === id);
        if (f) Object.assign(f, patch);
      });
    },

    removeFilter(id) {
      set((s) => {
        s.filters = s.filters.filter((f) => f.id !== id);
      });
    },

    clearFilters() {
      set({ filters: [] });
    },

    applyFilters() {
      const state = get();

      if (!state.filters.length) {
        set({ filteredRowOrder: [] });
      } else {
        set((s) => {
          s.filteredRowOrder = s.rowOrder.filter((rowId) => {
            const row = s.rowsById[rowId];
            return s.filters.every((f) => {
              const fn = filterOperationMap[f.operator];
              return fn?.(row.cells[f.columnId]?.value, f.value, f.value2);
            });
          });
        });
      }

      state.closePopup();
    },

    /* ---------------------------------------------------------------------- */
    /*                                SORT ACTIONS                            */
    /* ---------------------------------------------------------------------- */

    setSort(columnId, operator) {
      set((s) => {
        s.sort.columnId = columnId;
        s.sort.operator = operator;
      });
    },

    clearSort() {
      set((s) => {
        s.sort.columnId = null;
        s.sort.operator = "none";
      });
    },

    applySort() {
      const { sort, rowOrder, rowsById } = get();

      if (!sort.columnId || sort.operator === "none") {
        set({ filteredRowOrder: [] });
        get().closePopup();
        return;
      }

      const fn = sortOperationMap[sort.operator];

      set((s) => {
        s.filteredRowOrder = [...rowOrder].sort((a, b) => {
          const va = rowsById[a].cells[sort.columnId]?.value;
          const vb = rowsById[b].cells[sort.columnId]?.value;
          return fn?.(va, vb) ?? 0;
        });
      });

      get().closePopup();
    },

    /* ---------------------------------------------------------------------- */
    /*                             POPUP ACTIONS                              */
    /* ---------------------------------------------------------------------- */

    openPopup(id) {
      set({ activePopup: id });
    },

    closePopup() {
      set({ activePopup: null });
    },

    /* ---------------------------------------------------------------------- */
    /*                           COLUMN DRAG ACTIONS                          */
    /* ---------------------------------------------------------------------- */

    startColumnDrag(payload) {
      set({
        draggingColumn: {
          id: payload.id,
          fromIndex: payload.index,
          width: payload.width,
          left: payload.left,
          startX: payload.startX,
        },
        colDragMode: "reorder",
        colDragX: 0,
        colDragOverIndex: payload.index,
      });
    },

    updateColumnDrag(clientX) {
      set((s) => {
        if (!s.draggingColumn) return;

        s.colDragX = clientX - s.draggingColumn.startX;

        if (s.colDragMode === "resize") {
          s.resizeWidth = Math.max(60, s.draggingColumn.width + s.colDragX);
        }
      });
    },

    setColDragOverIndex(index) {
      set((s) => {
        if (s.colDragOverIndex !== index) {
          s.colDragOverIndex = index;
        }
      });
    },

    endColumnDrag() {
      set((s) => {
        if (!s.draggingColumn) return;

        if (s.colDragMode === "reorder") {
          const { fromIndex } = s.draggingColumn;
          const toIndex = s.colDragOverIndex;
          if (fromIndex !== toIndex) {
            s.columnOrder = moveItem(s.columnOrder, fromIndex, toIndex);
          }
        }

        if (s.colDragMode === "resize") {
          s.columnWidths[s.draggingColumn.id] = s.resizeWidth;
        }

        s.draggingColumn = null;
        s.colDragMode = null;
        s.colDragX = 0;
        s.resizeWidth = null;
        s.colDragOverIndex = null;
      });
    },

    startColumnResize(payload) {
      set({
        draggingColumn: {
          id: payload.id,
          width: payload.width,
          left: payload.left,
          startX: payload.startX,
        },
        colDragMode: "resize",
        colDragX: 0,
        resizeWidth: payload.width,
      });
    },

    /* ---------------------------------------------------------------------- */
    /*                             ROW DRAG ACTIONS                           */
    /* ---------------------------------------------------------------------- */

    startRowDrag(payload) {
      set({
        draggingRow: {
          id: payload.id,
          fromIndex: payload.index,
          top: payload.top,
          height: payload.height,
          startY: payload.startY,
        },
        rowDragY: 0,
        rowDragOverIndex: payload.index,
      });
    },

    updateRowDrag(clientY) {
      set((s) => {
        if (!s.draggingRow) return;
        s.rowDragY = clientY - s.draggingRow.startY;
      });
    },

    setRowDragOverIndex(index) {
      set((s) => {
        if (s.rowDragOverIndex !== index) {
          s.rowDragOverIndex = index;
        }
      });
    },

    endRowDrag() {
      set((s) => {
        if (!s.draggingRow) return;

        const { fromIndex } = s.draggingRow;
        const toIndex = s.rowDragOverIndex;

        if (fromIndex !== toIndex) {
          s.rowOrder = moveItem(s.rowOrder, fromIndex, toIndex);
        }

        s.draggingRow = null;
        s.rowDragY = 0;
        s.rowDragOverIndex = null;
      });
    },

    /* ------------------------------------------------------------- */
    /*                    CELL ACTIONS                               */
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

        console.log(affectedMap);
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
  }))
);
