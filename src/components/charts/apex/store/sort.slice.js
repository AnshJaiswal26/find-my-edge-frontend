import { sortOperationMap } from "@utils";

export const createSortSlice = (set, get) => ({
  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  updateSort(chartId, key, operator) {
    set((s) => {
      s[chartId].sort.key = key;
      s[chartId].sort.operator = operator;
    });
  },

  clearSort(chartId) {
    set((s) => {
      s[chartId].sort.key = null;
      s[chartId].sort.operator = "none";
      s[chartId].sortedOrder = [];
    });

    get().closePopup();
  },

  applySort(chartId) {
    const { [chartId]: chart, seriesById, closePopup } = get();

    const sort = chart.sort;

    if (!sort.key || sort.operator === "none") {
      set((s) => {
        s[chartId].sortedOrder = [];
      });
      closePopup();
      return;
    }

    const fn = sortOperationMap[sort.operator];

    set((s) => {
      const order = s[chartId].filteredOrder.length
        ? s[chartId].filteredOrder
        : s.seriesOrder;

      s[chartId].sortedOrder = [...order].sort((a, b) => {
        const va = seriesById[a][sort.key];
        const vb = seriesById[b][sort.key];
        return fn?.(va, vb) ?? 0;
      });
    });

    closePopup();
  },
});
