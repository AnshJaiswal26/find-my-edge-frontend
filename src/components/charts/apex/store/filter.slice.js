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
    set((s) => {
      s[chartId].filters = [];
    });
    get().closePopup();
  },

  applyFilters(chartId, filters) {
    set((s) => {
      s[chartId].filters = filters;
    });
    get().closePopup();
  },
});
