export const createSeriesSlice = (set) => ({
  setXSeries(chartId, key) {
    set((s) => {
      s.charts[chartId].xSeriesConfig.key = key;
    });
  },

  updateYSeries(chartId, index, patch) {
    set((s) => {
      Object.assign(s.charts[chartId].ySeriesConfig[index], patch);
    });
  },

  addYSeries(chartId, config) {
    set((s) => {
      s.charts[chartId].ySeriesConfig.push(config);
    });
  },

  resetSeries(chartId) {
    set((s) => {
      s[chartId].filteredOrder = s.seriesOrder;
    });
  },
});
