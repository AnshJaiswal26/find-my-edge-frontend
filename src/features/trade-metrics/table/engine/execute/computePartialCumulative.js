import { evaluateExpression } from "./evaluateExpression";

export function computePartialCumulative(
  rowsById,
  rowOrder,
  startIndex,
  column,
  columnsById
) {
  let prevValue;
  let prevRow;

  // 🔹 seed typed state
  if (startIndex === 0) {
    prevValue = {
      value: column.initialValue ?? 0,
      valueType: column.valueType ?? null,
    };
    prevRow = null;
  } else {
    prevRow = rowsById[rowOrder[startIndex - 1]];
    prevValue = {
      value: prevRow.cells[column.id]?.value ?? column.initialValue ?? 0,
      valueType: column.valueType ?? null,
    };
  }

  // 🔹 recompute downward
  for (let i = startIndex; i < rowOrder.length; i++) {
    const row = rowsById[rowOrder[i]];

    const res = evaluateExpression(column.expression, row, {
      prevValue,
      prevRow,
      rowsById,
      rowOrder,
      rowIndex: i,
      columnsById,
      evaluate: evaluateExpression,
    });

    if (res) {
      // 🔒 lock column type if not yet locked
      if (!column.valueType) {
        column.valueType = res.valueType;
        prevValue.valueType = res.valueType;
      }

      row.cells[column.id].value = res.value;
      prevValue = res;
    } else {
      row.cells[column.id].value = null;
      // keep prevValue as-is for cumulative continuity
    }

    prevRow = row;
  }
}
