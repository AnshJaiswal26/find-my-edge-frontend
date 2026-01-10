import { evaluateExpression } from "./evaluateExpression";

export function computeRow(rows, column) {
  rows.forEach((row) => {
    row.cells[column.id].value = evaluateExpression(column.expression, row, {
      evaluate: evaluateExpression,
    });
  });
}
