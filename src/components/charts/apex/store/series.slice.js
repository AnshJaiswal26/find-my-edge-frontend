export const createSeriesSlice = (set, get) => ({
  setXSeries(chartId, key) {
    set((s) => {
      s[chartId].xSeriesConfig.key = key;
    });
  },

  updateYSeries(chartId, index, patch) {
    set((s) => {
      Object.assign(s[chartId].ySeriesConfig[index], patch);
    });
  },

  addYSeries(chartId, config) {
    set((s) => {
      s[chartId].ySeriesConfig.push(config);
    });
  },

  updateSelection(chartId, from, to) {
    set((s) => {
      if (to - from <= 1) {
        s[chartId].selection.from = s[chartId].selection.from + from;
        s[chartId].selection.to = s[chartId].selection.to + to;
      } else {
        s[chartId].selection.from = from;
        s[chartId].selection.to = to;
      }
    });
  },

  resetSeries(chartId) {
    set((s) => {
      s[chartId].filters = [];
      s[chartId].sort = [];
      s[chartId].selection.from = null;
      s[chartId].selection.to = null;

      // s[chartId].selectionOrder = [];
    });
  },
});
