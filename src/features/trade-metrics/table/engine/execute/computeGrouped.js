import { evaluateExpression } from "./evaluateExpression";

export function computeGrouped(rows, column, columnsById) {
  const { by, startValue = 0 } = column.mode;

  let prevValue = {
    value: startValue,
    valueType: column.valueType ?? null,
  };

  let prevRow = null;
  let lastGroup = null;

  rows.forEach((row, rowIndex) => {
    const group = row.cells[by]?.value;

    // 🔄 reset on group change
    if (group !== lastGroup) {
      prevValue = {
        value: startValue,
        valueType: column.valueType,
      };
      lastGroup = group;
    }

    const res = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
      rows,
      rowIndex,
      columnsById,
      evaluate: evaluateExpression,
    });

    if (res) {
      // 🔒 lock column type once
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
