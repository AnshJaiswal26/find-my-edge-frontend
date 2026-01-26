import { FILTER_OPERATION_MAP } from "@utils";

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
        key: Object.keys(s.columnsById)[0],
        operator: "none",
        value: "",
        value2: "",
      });
    });
  },

  updateFilter(index, patch) {
    set((s) => {
      const f = s.filters.find((_, i) => i === index);
      if (f) Object.assign(f, patch);
    });
  },

  removeFilter(index) {
    set((s) => {
      s.filters = s.filters.filter((f, i) => i !== index);
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
            const fn = FILTER_OPERATION_MAP[f.operator];
            return fn?.(row.cells[f.key]?.value, f.value, f.value2);
          });
        });
      });
    }

    if (groupBy) buildGroups();

    closePopup();
  },
});
