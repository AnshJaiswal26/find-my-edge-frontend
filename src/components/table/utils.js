// utils/tableUtils.ts

export const TONE_CLASS = {
  profit: "text-(--success) bg-(--success-soft)",
  loss: "text-(--error) bg-(--error-soft)",
  neutral: "bg-(--surface)",
  muted: "bg-(--surface)",
};

export function formatValue(value, column) {
  if (value == null) return "—";

  const isNumber = typeof value === "number" && !Number.isNaN(value);

  if (column.display?.format === "currency") {
    return isNumber ? `₹${value.toFixed(column.display.decimals ?? 0)}` : "—";
  }

  if (column.display?.format === "percent") {
    return isNumber ? `${value.toFixed(column.display.decimals ?? 0)}%` : "—";
  }

  if (column.display?.format === "ratio") {
    return isNumber ? `1:${value.toFixed(column.display.decimals ?? 0)}` : "—";
  }

  return String(value);
}

// utils/array.ts
export function moveItem(arr, from, to) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function evaluateExpression(expr, row) {
  switch (expr.type) {
    case "constant":
      return expr.value;

    case "column": {
      const cell = row.cells[expr.columnId];
      return cell?.value ?? null;
    }

    case "binary": {
      const left = evaluateExpression(expr.left, row);
      const right = evaluateExpression(expr.right, row);

      if (left == null || right == null) return null;

      switch (expr.op) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return right === 0 ? null : left / right;
        default:
          return null;
      }
    }

    default:
      return null;
  }
}
