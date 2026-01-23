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

  buildGroups: (config) => {
    const {
      rowOrder,
      sortedRowOrder,
      groupBy,
      filteredRowOrder,
      rowsById,
      columnsById,
      recompute,
    } = get();

    const groupConfig = config ?? groupBy;

    if (!groupConfig) {
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
      columnsById,
      groupBy: groupConfig,
    });

    const groups = groupRowsBy({
      rowOrder: effectiveRowOrder,
      getGroupName,
    });

    set({ groups });

    recompute({ reason: "all" });
  },
});
