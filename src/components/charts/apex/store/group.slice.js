export const createGroupSlice = (set) => ({
  setGroupBy(chartId, config) {
    set((s) => {
      s.charts[chartId].groupBy = config;
    });
  },

  clearGroupBy(chartId) {
    set((s) => {
      s.charts[chartId].groupBy = null;
    });
  },
});
