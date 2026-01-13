export function groupRowsBy({ rowOrder, getGroupName }) {
  const map = new Map();

  for (const rowId of rowOrder) {
    const { groupId, label } = getGroupName(rowId);

    if (!map.has(groupId)) {
      map.set(groupId, {
        groupId,
        label,
        rowIds: [],
      });
    }

    map.get(groupId).rowIds.push(rowId);
  }

  return Array.from(map.values());
}
