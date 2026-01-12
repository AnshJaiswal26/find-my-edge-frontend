import { sortOperationMap } from "@utils";

export const createSortSlice = (set, get) => ({
  sort: {
    columnId: null,
    operator: "none",
  },

  sortedRowOrder: [],

  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  updateSort(columnId, operator) {
    set((s) => {
      s.sort.columnId = columnId;
      s.sort.operator = operator;
    });
  },

  clearSort() {
    const { buildGroups, groupBy, closePopup } = get();
    set((s) => {
      s.sort.columnId = null;
      s.sort.operator = "none";
      s.sortedRowOrder = [];
    });

    if (groupBy) buildGroups();
    closePopup();
  },

  applySort() {
    const { sort, rowsById, groupBy, closePopup, buildGroups } = get();

    if (!sort.columnId || sort.operator === "none") {
      set({ sortedRowOrder: [] });
      closePopup();
      return;
    }

    const fn = sortOperationMap[sort.operator];

    set((s) => {
      const order = s.filteredRowOrder.length ? s.filteredRowOrder : s.rowOrder;

      s.sortedRowOrder = [...order].sort((a, b) => {
        const va = rowsById[a].cells[sort.columnId]?.value;
        const vb = rowsById[b].cells[sort.columnId]?.value;
        return fn?.(va, vb) ?? 0;
      });
    });

    if (groupBy) buildGroups();

    closePopup();
  },
});
