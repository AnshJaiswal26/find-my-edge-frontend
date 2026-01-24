export const createLayoutSlice = (set, get) => ({
  updateLayout(chartId, layoutDraft, seriesDraft) {
    set((s) => {
      Object.assign(s[chartId].layout, layoutDraft);
      if (s[chartId].ySeriesConfig) {
        s[chartId].ySeriesConfig = seriesDraft;
      } else {
        s[chartId].seriesConfig = seriesDraft;
      }
    });

    get().closePopup();
  },

  toggleLayout(chartId, key) {
    set((s) => {
      s[chartId].layout[key] = !s[chartId].layout[key];
    });
  },
});
