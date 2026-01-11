export function groupRowsBy({ rowOrder, getGroupKey, groupLabels }) {
  const map = new Map();

  for (const rowId of rowOrder) {
    const key = getGroupKey(rowId);

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(rowId);
  }

  return Array.from(map.entries()).map(([groupKey, rowIds]) => ({
    groupId: String(groupKey),
    groupKey,
    label: groupLabels?.[groupKey] ?? String(groupKey),
    rowIds,
  }));
}
