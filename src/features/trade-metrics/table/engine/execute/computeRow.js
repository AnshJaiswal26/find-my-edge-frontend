import { evaluateExpression } from "./evaluateExpression";

export function computeRow(rowsById, rowOrder, column) {
  rowOrder.forEach((rowId) => {
    const row = rowsById[rowId];
    row.cells[column.id].value = evaluateExpression(column.expression, row, {
      evaluate: evaluateExpression,
    });
  });
}
