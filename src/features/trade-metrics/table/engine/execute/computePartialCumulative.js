import { evaluateExpression } from "./evaluateExpression";

export function computePartialCumulative(
  rowsById,
  rowOrder,
  startIndex,
  column
) {
  let prevValue;
  let prevRow;

  // 🔹 seed state
  if (startIndex === 0) {
    prevValue = column.initialValue ?? 0;
    prevRow = null;
  } else {
    prevRow = rowsById[rowOrder[startIndex - 1]];
    prevValue = prevRow.cells[column.id]?.value ?? column.initialValue ?? 0;
  }

  // 🔹 recompute downward
  for (let i = startIndex; i < rowOrder.length; i++) {
    const row = rowsById[rowOrder[i]];

    const value = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
    });

    row.cells[column.id].value = value;
    prevValue = value;
    prevRow = row;
  }
}
