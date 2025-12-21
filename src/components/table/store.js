// store/useTableStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { columnsById } from "./data";
import { evaluateExpression, moveItem } from "./tableUtils";

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

function createTrade(columnsById) {
  const cells = {};
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  Object.values(columnsById).forEach((column) => {
    let value = null;

    switch (column.type) {
      case "number":
      case "computed":
        value = 0;
        break;

      case "date":
        value = today;
        break;

      case "text":
        value = "-";
        break;

      case "select":
        value = ""; // or null if you prefer
        break;

      default:
        value = null;
    }

    cells[column.id] = {
      value,
      meta: {},
    };
  });

  return {
    id: crypto.randomUUID(),
    cells,
  };
}

function computeComputedColumns(row, columnsById) {
  Object.values(columnsById).forEach((column) => {
    if (column.type !== "computed") return;
    if (!column.expression) return;

    const value = evaluateExpression(column.expression, row);
    row.cells[column.id].value = value;
  });
}

export const useTableStore = create(
  immer((set, get) => ({
    rowsById: {},
    columnsById: { ...columnsById },
    rowOrder: [],
    columnOrder: [],
    columnWidths: {},
    activePopup: null,
    selectedColumn: null,

    draggingColumn: null,
    colDragMode: null, // "reorder" | "resize"
    colDragX: 0,
    resizeWidth: null,
    colDragOverIndex: null,

    draggingRow: null,
    rowDragY: 0,
    rowDragOverIndex: null,

    openPopup(id) {
      set({ activePopup: id });
    },

    closePopup() {
      set({ activePopup: null });
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

    unselectColumn(id) {
      if (id && get().selectedColumn.id === id) return;

      set({
        selectedColumn: null,
        colDragMode: null,
      });
    },

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

    endColumnResize() {
      set((s) => {
        s.isResizingColumn = false;
      });
    },

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

    updateCell(rowId, colId, value, error) {
      set((state) => {
        state.rowsById[rowId].cells[colId].value = value;
        state.rowsById[rowId].cells[colId].meta.error = error;
      });

      get().recompute();
    },

    recompute() {
      set((state) => {
        state.rowOrder.forEach((rowId) => {
          const row = state.rowsById[rowId];

          computeComputedColumns(row, state.columnsById);
        });
      });
    },

    initDemoData() {
      const state = get();

      const t1 = createTrade(state.columnsById);
      const t2 = createTrade(state.columnsById);

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

      set({
        rowsById: { [t1.id]: t1, [t2.id]: t2 },
        rowOrder: [t1.id, t2.id],
        columnOrder: Object.keys(state.columnsById),
      });

      state.recompute();
    },

    // toolbar actions
    addTrade() {
      const t = createTrade(get().columnsById);
      Object.values(t.cells).forEach((cell) => {
        cell.value = "";
      });

      set((s) => {
        s.rowsById[t.id] = t;
        s.rowOrder.push(t.id);
      });
    },

    addMetric(metric) {
      set((s) => {
        // 1️⃣ Register column
        s.columnsById[metric.id] = {
          ...metric,
          editable: false,
          display: { format: "currency", decimals: 2 },
        };
        s.columnOrder.push(metric.id);

        // 2️⃣ Add cell to every existing row
        Object.values(s.rowsById).forEach((row) => {
          row.cells[metric.id] = {
            value: getInitialCellValue(metric),
            meta: {},
          };
        });
      });

      // 3️⃣ Recompute computed columns
      get().recompute();
    },
  }))
);
