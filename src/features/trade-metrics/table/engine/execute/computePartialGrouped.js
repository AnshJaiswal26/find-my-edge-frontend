import { evaluateExpression } from "./evaluateExpression";

export function computePartialGrouped(rowsById, rowOrder, startIndex, column) {
  const { by, startValue = 0 } = column.mode;

  let prevValue;
  let prevRow;
  let lastGroup;

  if (startIndex === 0) {
    prevValue = startValue;
    prevRow = null;
    lastGroup = null;
  } else {
    prevRow = rowsById[rowOrder[startIndex - 1]];
    lastGroup = prevRow.cells[by]?.value;

    prevValue = prevRow.cells[column.id]?.value ?? startValue;
  }

  for (let i = startIndex; i < rowOrder.length; i++) {
    const row = rowsById[rowOrder[i]];
    const group = row.cells[by]?.value;

    if (group !== lastGroup) {
      prevValue = startValue;
      lastGroup = group;
    }

    const value = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
    });

    row.cells[column.id].value = value;
    prevValue = value;
    prevRow = row;
  }
}
