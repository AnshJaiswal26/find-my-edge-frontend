export const createSortSlice = (set, get) => ({
  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  applySort(chartId, key, operator) {
    set((s) => {
      s.charts[chartId].sort.key = key;
      s.charts[chartId].sort.operator = operator;
    });
    get().closePopup();
  },

  clearSort(chartId) {
    set((s) => {
      s.charts[chartId].sort = { key: null, operator: "none" };
    });
    get().closePopup();
  },
});
