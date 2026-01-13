import { evaluateExpression } from "./evaluateExpression";

export function computeCumulative(rowsById, rowOrder, column) {
  let prevValue = column.initialValue ?? 0;

  let prevRow = null;

  const rows = rowOrder.map((id) => rowsById[id]);

  rows.forEach((row, rowIndex) => {
    const value = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
      rows,
      rowIndex,
      evaluate: evaluateExpression,
    });

    row.cells[column.id].value = value;
    prevValue = value;
    prevRow = row;
  });
}
