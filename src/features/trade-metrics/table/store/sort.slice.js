import { useTradeStore } from "@shared/stores";
import { applySort } from "@shared/utils";

export const createSortSlice = (set, get) => ({
  sort: {
    columnId: null,
    operator: "none",
  },

  sortedRowOrder: [],

  /* ----------------------------------------------- */
  /*                SORT ACTIONS                     */
  /* ----------------------------------------------- */

  updateSort(columnId, operator) {
    set((s) => {
      s.sort.columnId = columnId;
      s.sort.operator = operator;
    });
  },

  clearSort() {
    const { buildGroups, groupBy, closePopup, updateLockedColumns } = get();
    set((s) => {
      s.sort.columnId = null;
      s.sort.operator = "none";
      s.sortedRowOrder = [];
    });

    if (groupBy) buildGroups();
    else updateLockedColumns();

    closePopup();
  },

  applySort() {
    const {
      sort,
      groupBy,
      closePopup,
      buildGroups,
      updateLockedColumns,
      filteredRowOrder,
      derivedViewByTradeId,
    } = get();

    const { tradesOrder, tradesById, derivedByTradeId } =
      useTradeStore.getState();

    if (!sort.columnId || sort.operator === "none") {
      set({ sortedRowOrder: [] });
      closePopup();
      return;
    }

    //  unified value resolver
    const getValue = (tradeId, colId) => {
      return (
        derivedByTradeId?.[tradeId]?.[colId] ?? // computed
        tradesById?.[tradeId]?.[colId] ?? // raw
        null
      );
    };

    const order = filteredRowOrder.length ? filteredRowOrder : tradesOrder;

    console.log("applying sort on order", order);
    set((s) => {
      s.sortedRowOrder = applySort(
        order,
        { key: sort.columnId, operator: sort.operator },
        getValue,
      );
    });

    if (groupBy) buildGroups();
    else updateLockedColumns();

    closePopup();
  },
});
