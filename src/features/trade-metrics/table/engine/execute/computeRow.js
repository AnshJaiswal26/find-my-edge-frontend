import { evaluateExpression } from "./evaluateExpression";

export function computeRow(rows, column, columnsById) {
  rows.forEach((row, i) => {
    const res = evaluateExpression(column.expression, row, {
      columnsById,
      evaluate: evaluateExpression,
    });

    if (res) {
      // 🔒 lock column type on first valid result
      if (!column.valueType) {
        column.valueType = res.valueType;
      }

      row.cells[column.id].value = res.value;
    } else {
      row.cells[column.id].value = null;
    }
  });
}
