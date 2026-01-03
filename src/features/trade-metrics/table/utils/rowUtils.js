export function getRowIndex(rowOrder, rowId) {
  return rowOrder.indexOf(rowId);
}

export function getRowsFrom(rowsById, rowOrder, startIndex = 0) {
  return rowOrder.slice(startIndex).map((id) => rowsById[id]);
}
