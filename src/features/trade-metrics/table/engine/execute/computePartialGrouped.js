import { evaluateExpression } from "./evaluateExpression";

export function computePartialGrouped(
  rowsById,
  rowOrder,
  startIndex,
  column,
  columnsById
) {
  const { by, startValue = 0 } = column.mode;

  let prevValue;
  let prevRow;
  let lastGroup;

  // 🔹 seed typed state
  if (startIndex === 0) {
    prevValue = {
      value: startValue,
      valueType: column.valueType ?? null,
    };
    prevRow = null;
    lastGroup = null;
  } else {
    prevRow = rowsById[rowOrder[startIndex - 1]];
    lastGroup = prevRow.cells[by]?.value;

    prevValue = {
      value: prevRow.cells[column.id]?.value ?? startValue,
      valueType: column.valueType ?? null,
    };
  }

  // 🔹 recompute downward
  for (let i = startIndex; i < rowOrder.length; i++) {
    const row = rowsById[rowOrder[i]];
    const group = row.cells[by]?.value;

    // 🔄 reset on group change (value only, keep type)
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
      rowsById,
      rowOrder,
      rowIndex: i,
      columnsById,
      evaluate: evaluateExpression,
    });

    if (res) {
      // 🔒 lock column type if needed
      if (!column.valueType) {
        column.valueType = res.valueType;
        prevValue.valueType = res.valueType;
      }

      row.cells[column.id].value = res.value;
      prevValue = res;
    } else {
      row.cells[column.id].value = null;
      // keep prevValue for continuity
    }

    prevRow = row;
  }
}
