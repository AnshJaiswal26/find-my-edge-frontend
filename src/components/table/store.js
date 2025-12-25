// store/useTableStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { columnsById } from "./data";
import {
  evaluateExpression,
  formatValue,
  moveItem,
  evaluateColorRules,
} from "./tableUtils";
import { filterOperationMap, sortOperationMap } from "@utils";

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function getInitialCellValue(column) {
  switch (column.type) {
    case "number":
    case "computed":
      return 0;
    case "date":
      return new Date().toISOString().slice(0, 10);
    case "text":
      return "-";
    case "select":
      return "";
    default:
      return null;
  }
}

function createTrade(columnsById, format = false) {
  const cells = {};

  Object.values(columnsById).forEach((column) => {
    let value = getInitialCellValue(column);

    cells[column.id] = {
      value,
      display: format ? formatValue(value, column) : value,
      meta: {},
    };
  });

  return {
    id: crypto.randomUUID(),
    cells,
  };
}

function computeRows(row, columnsById) {
  Object.values(columnsById).forEach((column) => {
    if (column.type !== "computed" || !column.expression) return;

    const value = evaluateExpression(column.expression, row);
    row.cells[column.id].value = value;
    row.cells[column.id].display = formatValue(value, column);
  });
}

function computeColumn(rowsById, column) {
  if (column.type !== "computed" || !column.expression) return;

  Object.values(rowsById).forEach((row) => {
    const value = evaluateExpression(column.expression, row);
    row.cells[column.id].value = value;
    row.cells[column.id].display = formatValue(value, column);
  });
}

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

    activePopup: null,

    /* ---------------------------------------------------------------------- */
    /*                              SELECTION STATE                           */
    /* ---------------------------------------------------------------------- */

    selectedColumn: null,
    selectedRow: null,
    selectedCell: null,

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

    /* ---------------------------------------------------------------------- */
    /*                             SELECTION ACTIONS                          */
    /* ---------------------------------------------------------------------- */

    selectCell(payload) {
      set({ selectedCell: payload });
    },

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
      get().selectCell(null);
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

    updateCell(rowId, colId, input) {
      const state = get();
      const cell = state.rowsById[rowId].cells[colId];
      const column = state.columnsById[colId];

      const value = column?.parse ? column.parse(input) : input;
      if (cell.value === value) return;

      const error = column.validate?.(value) ?? null;

      set((s) => {
        s.rowsById[rowId].cells[colId].value = value;
        s.rowsById[rowId].cells[colId].display =
          column.type === "date" ? formatValue(value, column) : value;
        s.rowsById[rowId].cells[colId].meta.error = error;
      });

      if (column.type === "number") state.recompute({ rowId, colId });
    },

    recompute(payload) {
      set((state) => {
        if (!payload) {
          state.rowOrder.forEach((rowId) =>
            computeRows(state.rowsById[rowId], state.columnsById)
          );
        } else if (payload.rowId) {
          computeRows(state.rowsById[payload.rowId], state.columnsById);
        } else if (payload.colId) {
          computeColumn(state.rowsById, state.columnsById[payload.colId]);
        }
      });
    },

    /* ---------------------------------------------------------------------- */
    /*                              DATA ACTIONS                              */
    /* ---------------------------------------------------------------------- */

    initDemoData() {
      const state = get();
      const t1 = createTrade(state.columnsById);
      const t2 = createTrade(state.columnsById);

      // values
      t1.cells.date.value = "2025-04-15";
      t1.cells.symbol.value = "NIFTY";
      t1.cells.entry.value = 100;
      t1.cells.exit.value = 110;
      t1.cells.qty.value = 10;
      t1.cells.sl.value = 10;

      t2.cells.date.value = "2025-04-16";
      t2.cells.symbol.value = "BANKNIFTY";
      t2.cells.entry.value = 100;
      t2.cells.exit.value = 90;
      t2.cells.qty.value = 10;
      t2.cells.sl.value = 10;

      t1.cells.date.display = "2025-04-15";
      t1.cells.symbol.display = "NIFTY";
      t1.cells.entry.display = 100;
      t1.cells.exit.display = 110;
      t1.cells.qty.display = 10;
      t1.cells.sl.display = 10;

      t2.cells.date.display = "2025-04-16";
      t2.cells.symbol.display = "BANKNIFTY";
      t2.cells.entry.display = 100;
      t2.cells.exit.display = 90;
      t2.cells.qty.display = 10;
      t2.cells.sl.display = 10;

      set({
        rowsById: { [t1.id]: t1, [t2.id]: t2 },
        rowOrder: [t1.id, t2.id],
        columnOrder: Object.keys(state.columnsById),
      });

      state.recompute();
    },

    /* ---------------------------------------------------------------------- */
    /*                              ROW ACTIONS                               */
    /* ---------------------------------------------------------------------- */

    addTrade() {
      const t = createTrade(get().columnsById, true);
      set((s) => {
        s.rowsById[t.id] = t;
        s.rowOrder.push(t.id);
      });
    },

    /* ---------------------------------------------------------------------- */
    /*                              COLUMN ACTIONS                            */
    /* ---------------------------------------------------------------------- */

    addColumn(metric) {
      set((s) => {
        s.columnsById[metric.id] = metric;
        s.columnOrder.push(metric.id);

        Object.values(s.rowsById).forEach((row) => {
          const value = getInitialCellValue(metric);
          row.cells[metric.id] = { value, display: value, meta: {} };
        });
      });

      get().recompute({ colId: metric.id });
    },

    deleteColumn() {
      const { selectedColumn } = get();
      if (!selectedColumn?.id) return;

      const colId = selectedColumn.id;

      set((s) => {
        s.columnOrder = s.columnOrder.filter((id) => id !== colId);
        Object.values(s.rowsById).forEach((row) => delete row.cells[colId]);
        delete s.columnsById[colId];
        s.selectedColumn = null;
      });
    },

    updateColumn(activeColId, draft) {
      set((s) => {
        const col = s.columnsById[activeColId];

        // label
        col.label = draft.label;

        // computed
        if (col.type === "computed") {
          col.formula = draft.formula;
          col.expression = ast;
        }

        // select
        if (col.type === "select") {
          col.options = draft.options.map((o) => o.trim());
        }
      });

      if (draft.type === "computed") get().recompute({ colId: activeColId });
    },
  }))
);
