import { filterOperationMap } from "@utils";

export const createFilterSlice = (set, get) => ({
  filters: [],
  filteredRowOrder: [],

  /* ------------------------------------------------ */
  /*                 FILTER ACTIONS                   */
  /* ------------------------------------------------ */

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
    set((s) => {
      s.filters = [];
      s.filteredRowOrder = [];
    });

    const { closePopup, groupBy, buildGroups } = get();

    if (groupBy) buildGroups();
    closePopup();
  },

  applyFilters() {
    const { filters, closePopup, groupBy, buildGroups } = get();

    if (!filters.length) {
      set({ filteredRowOrder: [] });
    } else {
      set((s) => {
        s.filteredRowOrder = s.rowOrder.filter((rowId) => {
          const row = s.rowsById[rowId];
          return s.filters.some((f) => {
            const fn = filterOperationMap[f.operator];
            return fn?.(row.cells[f.columnId]?.value, f.value, f.value2);
          });
        });
      });
    }

    if (groupBy) buildGroups();

    closePopup();
  },
});
