import { evaluateExpression } from "./evaluateExpression";

export function computeCumulative(rows, column) {
  let prevValue = column.initialValue ?? 0;
  let prevRow = null;

  rows.forEach((row) => {
    const value = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
    });

    row.cells[column.id].value = value;
    prevValue = value;
    prevRow = row;
  });
}
