// store/useTableStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { columnsById } from "./data";
import { moveItem } from "./utils";

function createTrade() {
  const cells = {};
  Object.keys(columnsById).forEach((colId) => {
    cells[colId] = { value: null, meta: {} };
  });

  return {
    id: crypto.randomUUID(),
    cells,
  };
}

export const useTableStore = create(
  immer((set, get) => ({
    rowsById: {},
    rowOrder: [],
    columnOrder: [],
    columnWidths: {},

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
          const { entry, exit, qty } = row.cells;

          const val =
            entry.value != null && exit.value != null && qty.value != null
              ? (exit.value - entry.value) * qty.value
              : null;

          row.cells.pnl.value = val;

          row.cells.rr.value = val / 100;
        });
      });
    },

    initDemoData() {
      const t1 = createTrade();
      const t2 = createTrade();

      t1.cells.date.value = "2025-04-15";
      t1.cells.symbol.value = "NIFTY";
      t1.cells.entry.value = 22500;
      t1.cells.exit.value = 22560;
      t1.cells.qty.value = 2;

      t2.cells.date.value = "2025-04-16";
      t2.cells.symbol.value = "BANKNIFTY";
      t2.cells.entry.value = 48000;
      t2.cells.exit.value = 47800;
      t2.cells.qty.value = 1;

      set({
        rowsById: { [t1.id]: t1, [t2.id]: t2 },
        rowOrder: [t1.id, t2.id],
        columnOrder: Object.keys(columnsById),
      });

      get().recompute();
    },
  }))
);
