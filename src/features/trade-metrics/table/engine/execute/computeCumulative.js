import { evaluateExpression } from "./evaluateExpression";

export function computeCumulative(rows, column, columnsById) {
  let prevValue = {
    value: column.initialValue ?? 0,
    valueType: column.valueType ?? null,
  };

  let prevRow = null;

  rows.forEach((row, rowIndex) => {
    const res = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
      rows,
      rowIndex,
      columnsById,
      evaluate: evaluateExpression,
    });

    if (res) {
      // 🔒 lock column type on first real result
      if (!column.valueType) {
        column.valueType = res.valueType;
        prevValue.valueType = res.valueType;
      }

      row.cells[column.id].value = res.value;
      prevValue = res;
    } else {
      row.cells[column.id].value = null;
    }

    prevRow = row;
  });
}
