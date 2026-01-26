import { SORT_OPERATION_MAP } from "@utils";

export const createSortSlice = (set, get) => ({
  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  applySort(chartId, key, operator) {
    set((s) => {
      s[chartId].sort.key = key;
      s[chartId].sort.operator = operator;
    });
    get().closePopup();
  },

  clearSort(chartId) {
    set((s) => {
      s[chartId].sort = { key: null, operator: "none" };
    });
    get().closePopup();
  },
});
