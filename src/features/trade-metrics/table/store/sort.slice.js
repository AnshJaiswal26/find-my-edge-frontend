import { useTradeStore } from "@stores";
import { SORT_OPERATION_MAP } from "@utils";

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
      rowsOrder,
      derivedViewByTradeId,
    } = get();

    const { tradesById, derivedByTradeId } = useTradeStore.getState();

    if (!sort.columnId || sort.operator === "none") {
      set({ sortedRowOrder: [] });
      closePopup();
      return;
    }

    const fn = SORT_OPERATION_MAP[sort.operator];

    //  unified value resolver
    const getValue = (tradeId, colId) => {
      return (
        derivedByTradeId?.[tradeId]?.[colId] ?? // computed
        tradesById?.[tradeId]?.[colId] ?? // raw
        null
      );
    };

    const order = filteredRowOrder.length ? filteredRowOrder : rowsOrder;

    set((s) => {
      s.sortedRowOrder = [...order].sort((a, b) => {
        const va = getValue(a, sort.columnId);
        const vb = getValue(b, sort.columnId);
        return fn?.(va, vb) ?? 0;
      });
    });

    if (groupBy) buildGroups();
    else updateLockedColumns();

    closePopup();
  },
});
