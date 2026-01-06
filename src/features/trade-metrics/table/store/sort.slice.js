import { sortOperationMap } from "@utils";

export const createSortSlice = (set, get) => ({
  sort: {
    columnId: null,
    operator: "none",
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
});
