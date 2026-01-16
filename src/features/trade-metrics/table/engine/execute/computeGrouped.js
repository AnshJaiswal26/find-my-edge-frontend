import { evaluateExpression } from "@lib/expression";

export function computeGrouped(rowsById, groups, column) {
  if (!groups || !groups.length) return;
  if (!column.expression) return;

  for (const group of groups) {
    let prevValue = column.initialValue ?? 0;
    let prevRow = null;

    for (const rowId of group.rowIds) {
      const row = rowsById[rowId];

      const value = evaluateExpression(column.expression, {
        getValue: (key) => row.cells[key]?.value ?? null,
        evaluate: evaluateExpression,
        prevValue,
        prevRow,
      });

      row.cells[column.id].value = value;
      prevValue = value;
      prevRow = row;
    }
  }
}
