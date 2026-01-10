export const createGroupSlice = (set, get) => ({
  /* ---------------- Grouping config ---------------- */
  groupBy: "symbol", // e.g. "symbol", "date", etc.

  setGroupBy: (key) =>
    set(() => ({
      groupBy: key,
      expandedGroups: {}, // reset expand state on regroup
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

  expandGroup: (groupId) =>
    set((state) => ({
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: true,
      },
    })),

  collapseGroup: (groupId) =>
    set((state) => ({
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: false,
      },
    })),

  collapseAllGroups: () =>
    set(() => ({
      expandedGroups: {},
    })),
});
