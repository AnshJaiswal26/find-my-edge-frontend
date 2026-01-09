import { evaluateExpression } from "./evaluateExpression";

export function computeGrouped(rows, column) {
  const { by, startValue = 0 } = column.mode;

  let prevValue = startValue;
  let prevRow = null;
  let lastGroup = null;

  rows.forEach((row) => {
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
  });
}
