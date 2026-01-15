import { filterOperationMap } from "@utils";

export const createFilterSlice = (set, get) => ({
  updateFilter(chartId, index, patch) {
    set((s) => {
      Object.assign(s[chartId].filters[index], patch);
    });
  },

  addFilter(chartId) {
    set((s) => {
      s[chartId].filters.push({
        key: "",
        operator: "none",
        value: "",
        value2: "",
      });
    });
  },

  removeFilter(chartId, index) {
    set((s) => {
      s[chartId].filters.splice(index, 1);
    });
  },

  clearFilters(chartId) {
    const { resetSeries, closePopup } = get();

    set((s) => {
      s[chartId].filters = [];
    });
    resetSeries(chartId);
    closePopup();
  },

  applyFilters(chartId) {
    const { [chartId]: chart, closePopup } = get();
    const filters = chart.filters;

    if (!filters.length) return;

    set((s) => {
      s[chartId].filteredOrder = s.seriesOrder.filter((id) => {
        return s[chartId].filters.some((f) => {
          const fn = filterOperationMap[f.operator];
          return fn?.(s.seriesById[id][f.key], f.value, f.value2);
        });
      });
    });

    closePopup();
  },
});
