import { chartEngine } from "../model/chartEngine";

export const createSortSlice = (set, get) => ({
  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  applySort(chartId, sort) {
    set((s) => {
      s.charts[chartId].sort.key = sort.key;
      s.charts[chartId].sort.operator = sort.operator;
    });
    chartEngine.get(chartId)?.recomputeSeries();

    get().closePopup();
  },

  clearSort(chartId) {
    set((s) => {
      s.charts[chartId].sort = { key: null, operator: "none" };
    });
    chartEngine.get(chartId)?.recomputeSeries();

    get().closePopup();
  },
});
