import { buildGroups, draftToSpec } from "@lib/analytics/engine/data";

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
    set(() => ({
      groupBy: null,
      groups: null,
      expandedGroups: {},
    }));

    get().closePopup();
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
    const { rowsById, sortedRowOrder, filteredRowOrder, rowOrder } = get();

    const effectiveOrder = sortedRowOrder.length
      ? sortedRowOrder
      : filteredRowOrder.length
        ? filteredRowOrder
        : rowOrder;

    const groups = buildGroups({
      tradeOrder: effectiveOrder,
      tradesById: rowsById,
      groupSpec: draftToSpec(spec),
      getValue: (row, key) => row.cells[key]?.value ?? null,
    });

    set({ groups });
    get().recompute({ reason: "all" });
  },
});
