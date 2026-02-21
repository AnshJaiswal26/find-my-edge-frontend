export const createSeriesSlice = (set, get) => ({
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

  updateSelection(chartId, from, to) {
    set((s) => {
      if (to - from <= 1) {
        s.charts[chartId].selection.from =
          s.charts[chartId].selection.from + from;
        s.charts[chartId].selection.to = s.charts[chartId].selection.to + to;
      } else {
        s.charts[chartId].selection.from = from;
        s.charts[chartId].selection.to = to;
      }
    });
  },

  resetSeries(chartId) {
    set((s) => {
      s.charts[chartId].filters = [];
      s.charts[chartId].sort = [];
      s.charts[chartId].selection.from = null;
      s.charts[chartId].selection.to = null;
    });
  },
});
