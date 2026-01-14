import { sortOperationMap } from "@utils";

export const createSortSlice = (set, get) => ({
  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  updateSort(chartId, seriesKey, operator) {
    set((s) => {
      const chart = s[chartId];
      if (!chart) return;

      chart.sort.seriesKey = seriesKey;
      chart.sort.operator = operator;
    });
  },

  clearSort(chartId) {
    set((s) => {
      const chart = s[chartId];
      if (!chart) return;

      chart.sort.seriesKey = null;
      chart.sort.operator = "none";
      chart.series.filtered = chart.series.default;
    });
  },

  applySort(chartId) {
    const chart = get()[chartId];
    if (!chart) return;

    const { seriesKey, operator } = chart.sort;

    if (!seriesKey || operator === "none") {
      set((s) => {
        s[chartId].series.filtered = chart.series.default;
      });
      return;
    }

    const sortFn = sortOperationMap[operator];

    set((s) => {
      const target = [...s[chartId].series.filtered];

      s[chartId].series.filtered = target.sort(
        (a, b) => sortFn?.(a[seriesKey], b[seriesKey]) ?? 0
      );
    });
  },
});
