import { evaluateExpression } from "./evaluateExpression";

export function usesPrev(expr) {
  if (!expr || typeof expr !== "object") return false;

  if (expr.type === "prev") {
    return true;
  }

  if (expr.type === "binary") {
    return usesPrev(expr.left) || usesPrev(expr.right);
  }

  if (expr.type === "unary") {
    return usesPrev(expr.arg);
  }

  return false;
}

export function evaluateCummulative(rowsById, rowOrder, column) {
  if (column.type !== "computed" || !usesPrev(column.expression)) return;

  const rows = rowOrder.map((id) => rowsById[id]);

  let prevSelf = column.startValue ?? 0;

  rows.forEach((row) => {
    const value = evaluateExpression(column.expression, row, prevSelf);
    row.cells[column.id].value = value;
    prevSelf = value;
  });
}
