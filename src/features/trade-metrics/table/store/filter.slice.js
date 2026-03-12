import { useTradeStore } from "@shared/stores";
import { applyFilters, FILTER_OPERATION_MAP } from "@shared/utils";

export const createFilterSlice = (set, get) => ({
  filters: [],
  filteredRowOrder: [],

  /* ------------------------------------------------ */
  /*                 FILTER ACTIONS                   */
  /* ------------------------------------------------ */

  addFilter() {
    set((s) => {
      s.filters.push({
        id: crypto.randomUUID(),
        key: Object.keys(s.columnsById)[0],
        operator: "none",
        value: 0,
        from: 0,
        to: 0,
      });
    });
  },

  updateFilter(index, patch) {
    set((s) => {
      const f = s.filters.find((_, i) => i === index);
      if (f) Object.assign(f, patch);
    });
  },

  removeFilter(index) {
    set((s) => {
      s.filters = s.filters.filter((f, i) => i !== index);
    });
  },

  clearFilters() {
    set((s) => {
      s.filters = [];
      s.filteredRowOrder = [];
    });

    const { closePopup, groupBy, buildGroups, updateLockedColumns } = get();

    if (groupBy) buildGroups();
    else updateLockedColumns();

    closePopup();
  },

  applyFilters() {
    const {
      filters,
      closePopup,
      groupBy,
      buildGroups,
      derivedViewByTradeId,
      updateLockedColumns,
    } = get();

    const { tradesById, tradesOrder, derivedByTradeId } =
      useTradeStore.getState();

    // 🔥 unified value resolver
    const getValue = (tradeId, colId) => {
      return (
        derivedByTradeId?.[tradeId]?.[colId] ?? // computed
        tradesById?.[tradeId]?.[colId] ?? // raw
        null
      );
    };

    if (!filters.length) {
      set({ filteredRowOrder: [] });
    } else {
      set((s) => {
        s.filteredRowOrder = tradesOrder.filter((tradeId) => {
          return applyFilters(filters, tradeId, getValue);
        });
      });
    }

    if (groupBy) buildGroups();
    else updateLockedColumns();

    closePopup();
  },
});
