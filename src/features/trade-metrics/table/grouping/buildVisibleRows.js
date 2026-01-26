export function buildVisibleRows(groups, expandedGroups) {
  const result = [];
  let index = 0;

  for (const group of groups) {
    result.push({
      type: "group",
      groupId: group.groupId,
      label: group.label,
    });

    if (expandedGroups[group.groupId]) {
      for (const rowId of group.tradeIds) {
        result.push({ type: "row", rowId, index });
        index++;
      }
    }
  }

  return result;
}
