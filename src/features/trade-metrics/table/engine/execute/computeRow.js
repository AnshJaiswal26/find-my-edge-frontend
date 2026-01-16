import { evaluateExpression } from "@lib/expression";

export function computeRow(rowsById, rowOrder, column) {
  rowOrder.forEach((rowId) => {
    const row = rowsById[rowId];
    row.cells[column.id].value = evaluateExpression(column.expression, {
      getValue: (key) => row.cells[key]?.value ?? null,
      evaluate: evaluateExpression,
    });
  });
}
