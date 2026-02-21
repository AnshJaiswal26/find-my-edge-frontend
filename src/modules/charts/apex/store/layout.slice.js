export const createLayoutSlice = (set, get) => ({
  updateLayout(chartId, layoutDraft, seriesDraft) {
    set((s) => {
      Object.assign(s.charts[chartId].layout, layoutDraft);
      if (s.charts[chartId].ySeriesConfig) {
        s.charts[chartId].ySeriesConfig = seriesDraft;
      } else {
        s.charts[chartId].seriesConfig = seriesDraft;
      }
    });

    get().closePopup();
  },

  toggleLayout(chartId, key) {
    set((s) => {
      s.charts[chartId].layout[key] = !s.charts[chartId].layout[key];
    });
  },
});
