export function buildVisibleRows(groups, expandedGroups) {
  const result = [];

  for (const group of groups) {
    result.push({
      type: "group",
      groupId: group.groupId,
      label: String(group.groupKey),
    });

    if (expandedGroups[group.groupId]) {
      for (const rowId of group.rowIds) {
        result.push({
          type: "row",
          rowId,
        });
      }
    }
  }

  return result;
}
