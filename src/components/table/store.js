// store/useTableStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { columnsById } from "./data";
import { evaluateExpression, moveItem } from "./utils";

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

    draggingColumn: null,
    dragMode: null, // "reorder" | "resize"
    dragX: 0,
    resizeWidth: null,
    dragOverIndex: null,

    openPopup(id) {
      set(() => ({ activePopup: id }));
    },

    closePopup() {
      set(() => ({ activePopup: null }));
    },

    startColumnDrag(payload) {
      set(() => ({
        draggingColumn: {
          id: payload.id,
          fromIndex: payload.index,
          width: payload.width,
          left: payload.left,
          top: payload.top,
          height: payload.height,
          startX: payload.startX,
        },
        dragMode: "reorder",
        dragX: 0,
        dragOverIndex: payload.index,
      }));
    },

    updateColumnDrag(clientX) {
      set((s) => {
        if (!s.draggingColumn) return;

        s.dragX = clientX - s.draggingColumn.startX;

        if (s.dragMode === "resize") {
          s.resizeWidth = Math.max(60, s.draggingColumn.width + s.dragX);
        }
      });
    },

    setDragOverIndex(index) {
      set((s) => {
        if (s.dragOverIndex !== index) {
          s.dragOverIndex = index;
        }
      });
    },

    endColumnDrag() {
      set((s) => {
        if (!s.draggingColumn) return;

        if (s.dragMode === "reorder") {
          const { fromIndex } = s.draggingColumn;
          const toIndex = s.dragOverIndex;

          if (fromIndex !== toIndex) {
            s.columnOrder = moveItem(s.columnOrder, fromIndex, toIndex);
          }
        }

        if (s.dragMode === "resize") {
          s.columnWidths[s.draggingColumn.id] = s.resizeWidth;
        }

        s.draggingColumn = null;
        s.dragMode = null;
        s.dragX = 0;
        s.resizeWidth = null;
        s.dragOverIndex = null;
      });
    },

    startColumnResize(payload) {
      set(() => ({
        draggingColumn: {
          id: payload.id,
          width: payload.width,
          left: payload.left,
          top: payload.top,
          height: payload.height,
          startX: payload.startX,
        },
        dragMode: "resize",
        dragX: 0,
        resizeWidth: payload.width,
      }));
    },

    endColumnResize() {
      set((s) => {
        s.isResizingColumn = false;
      });
    },

    reorderRow(from, to) {
      set((state) => {
        state.rowOrder = moveItem(state.rowOrder, from, to);
      });
    },

    reorderColumn(from, to) {
      set((state) => {
        state.columnOrder = moveItem(state.columnOrder, from, to);
      });
    },

    resizeColumn(colId, width) {
      set((state) => {
        state.columnWidths[colId] = Math.max(60, width);
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
