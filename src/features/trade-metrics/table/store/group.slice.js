import { buildGroups, draftToSpec } from "@lib/analytics/engine/data";
import { useTradeStore } from "@shared/stores";

export const createGroupSlice = (set, get) => ({
  groupBy: null,
  groups: null,

  /* ------------------------------------------------ */
  /*                 Group ACTIONS                    */
  /* ------------------------------------------------ */

  setGroupBy: (config) => {
    set(() => ({
      groupBy: config,
      expandedGroups: {},
    }));

    get().buildGroups(config);
    get().closePopup();
  },

  clearGroupBy: () => {
    const { closePopup, updateLockedColumns } = get();

    set(() => ({
      groupBy: null,
      groups: null,
      expandedGroups: {},
    }));
    updateLockedColumns();

    closePopup();
  },

  /* ---------------- Expand / Collapse ---------------- */

  expandedGroups: {},

  toggleGroup: (groupId) =>
    set((state) => ({
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: !state.expandedGroups[groupId],
      },
    })),

  collapseAllGroups: () =>
    set(() => ({
      expandedGroups: {},
    })),

  buildGroups: (spec) => {
    const {
      sortedRowOrder,
      filteredRowOrder,
      columnsById,
      groupBy,
      derivedViewByTradeId,
      updateLockedColumns,
    } = get();

    const { tradesOrder, tradesById, derivedByTradeId } =
      useTradeStore.getState();

    const effectiveOrder = sortedRowOrder.length
      ? sortedRowOrder
      : filteredRowOrder.length
        ? filteredRowOrder
        : tradesOrder;

    const getValue = (trade, key) => {
      return derivedByTradeId?.[trade.id]?.[key] ?? trade?.[key] ?? null;
    };

    const groups = buildGroups({
      tradesOrder: effectiveOrder,
      tradesById: tradesById,
      groupSpec: draftToSpec(spec ?? groupBy),
      getValue,
      getFormat: (key) => ({
        type: columnsById[key].semanticType,
        display: columnsById[key]?.display,
      }),
    });

    set((s) => {
      s.groups = groups;
      s.columnsOrder = [
        groupBy.key,
        ...s.columnsOrder.filter((id) => id !== groupBy.key),
      ];
    });

    updateLockedColumns();
  },
});
