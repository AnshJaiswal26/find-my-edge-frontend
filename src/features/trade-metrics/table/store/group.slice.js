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
    const { closePopup, recompute } = get();

    set(() => ({
      groupBy: null,
      groups: null,
      expandedGroups: {},
    }));

    recompute({ reason: "grouping" });
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
      rowsById,
      sortedRowOrder,
      filteredRowOrder,
      rowOrder,
      columnsById,
      groupBy,
      recompute,
    } = get();

    const effectiveOrder = sortedRowOrder.length
      ? sortedRowOrder
      : filteredRowOrder.length
        ? filteredRowOrder
        : rowOrder;

    const groups = buildGroups({
      tradeOrder: effectiveOrder,
      tradesById: rowsById,
      groupSpec: draftToSpec(spec ?? groupBy),
      getValue: (row, key) => row.cells[key]?.value ?? null,
      getFormat: (key) => ({
        type: columnsById[key].type,
        display: columnsById[key]?.display,
      }),
    });

    set({ groups });
    recompute({ reason: "grouping", groups });
  },
});
