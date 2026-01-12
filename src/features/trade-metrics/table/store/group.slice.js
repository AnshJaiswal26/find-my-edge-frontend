import { createGetGroupKey, groupRowsBy } from "../grouping";

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
    const { buildGroups, closePopup } = get();
    buildGroups();
    closePopup();
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

  buildGroups: () => {
    const { rowOrder, sortedRowOrder, filteredRowOrder, rowsById, groupBy } =
      get();

    if (!groupBy) {
      set({ groups: null });
      return;
    }

    const effectiveRowOrder = sortedRowOrder.length
      ? sortedRowOrder
      : filteredRowOrder.length
      ? filteredRowOrder
      : rowOrder;

    const getGroupName = createGetGroupKey({
      rowsById,
      groupBy,
    });

    const groups = groupRowsBy({
      rowOrder: effectiveRowOrder,
      getGroupName,
    });

    set({ groups });
  },
});
