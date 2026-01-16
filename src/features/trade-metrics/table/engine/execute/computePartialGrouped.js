import { evaluateExpression } from "@lib/expression";

export function computePartialGrouped(rowsById, group, startIndex, column) {
  const startValue = column.initialValue ?? 0;
  const rowIds = group.rowIds;

  let prevValue;
  let prevRow;

  if (startIndex === 0) {
    prevValue = startValue;
    prevRow = null;
  } else {
    const prevRowId = rowIds[startIndex - 1];
    prevRow = rowsById[prevRowId];
    prevValue = prevRow.cells[column.id]?.value ?? startValue;
  }

  for (let i = startIndex; i < rowIds.length; i++) {
    const row = rowsById[rowIds[i]];

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
