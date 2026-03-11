import { chartEngine } from "../model/chartEngine";

export const createFilterSlice = (set, get) => ({
  updateFilter(chartId, index, patch) {
    set((s) => {
      Object.assign(s.charts[chartId].filters[index], patch);
    });
  },

  addFilter(chartId) {
    set((s) => {
      s.charts[chartId].filters.push({
        key: "",
        operator: "none",
        value: 0,
        from: 0,
        to: 0,
      });
    });
  },

  removeFilter(chartId, index) {
    set((s) => {
      s.charts[chartId].filters.splice(index, 1);
    });
  },

  clearFilters(chartId) {
    set((s) => {
      s.charts[chartId].filters = [];
    });
    get().closePopup();
  },

  applyFilters(chartId, filters) {
    set((s) => {
      s.charts[chartId].filters = filters;
    });
    chartEngine.charts.get(chartId)?.computeSeries(filters);
    get().closePopup();
  },
});
