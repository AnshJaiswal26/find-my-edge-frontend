import { chartEngine } from "../model/chartEngine";

export const createLayoutSlice = (set, get) => ({
  updateLayout(chartId, layoutDraft, seriesDraft) {
    set((s) => {
      Object.assign(s.charts[chartId].layout, layoutDraft);
      s.charts[chartId].series = seriesDraft;
    });

    chartEngine.get(chartId).updateLayout(layoutDraft);

    get().closePopup();
  },

  toggleLayout(chartId, key) {
    set((s) => {
      s.charts[chartId].layout[key] = !s.charts[chartId].layout[key];
    });
  },
});
