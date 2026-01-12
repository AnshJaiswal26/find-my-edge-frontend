export function groupRowsBy({ rowOrder, getGroupName }) {
  const map = new Map();

  for (const rowId of rowOrder) {
    const key = getGroupName(rowId);

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(rowId);
  }

  return Array.from(map.entries()).map(([groupKey, rowIds]) => ({
    groupId: String(groupKey),
    label: groupKey,
    rowIds,
  }));
}
