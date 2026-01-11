export const createGroupSlice = (set, get) => ({
  /* ---------------- Grouping config ---------------- */

  groupBy: null,

  setGroupBy: (config) =>
    set(() => ({
      groupBy: {
        mode: "value",
        ...config,
      },
      expandedGroups: {},
    })),

  setConditionGroupBy: ({ key, type, operation, value, valueTo }) =>
    set(() => ({
      groupBy: {
        key,
        type,
        mode: "condition",
        operation,
        value,
        valueTo,
      },
      expandedGroups: {},
    })),

  clearGroupBy: () =>
    set(() => ({
      groupBy: null,
      expandedGroups: {},
    })),

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
});
