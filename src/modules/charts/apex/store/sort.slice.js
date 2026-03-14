import { chartEngine } from "../model/chartEngine";

export const createSortSlice = (set, get) => ({
  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  applySort(chartId, key, operator) {
    set((s) => {
      s.charts[chartId].sort.key = key;
      s.charts[chartId].sort.operator = operator;
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
