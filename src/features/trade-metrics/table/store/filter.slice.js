import { useTradeStore } from "@shared/stores";
import { applyFilters, FILTER_OPERATION_MAP } from "@shared/utils";

export const createFilterSlice = (set, get) => ({
  filters: [],
  filteredRowOrder: [],

  /* ------------------------------------------------ */
  /*                 FILTER ACTIONS                   */
  /* ------------------------------------------------ */

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

  applyFilters(filters) {
    const {
      closePopup,
      groupBy,
      buildGroups,
      sortedRowOrder,
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

    const order = sortedRowOrder.length ? sortedRowOrder : tradesOrder;

    if (!filters.length) {
      set({ filteredRowOrder: [] });
    } else {
      set((s) => {
        s.filters = filters;
        s.filteredRowOrder = order.filter((tradeId) => {
          return applyFilters(filters, tradeId, getValue);
        });
      });
    }

    if (groupBy) buildGroups();
    else updateLockedColumns();

    closePopup();
  },
});
