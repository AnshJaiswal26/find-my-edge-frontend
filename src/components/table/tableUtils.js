import { filterOperationMap } from "@utils";

export const TONE_CLASS = {
  profit: "text-(--success) bg-(--success-soft)",
  loss: "text-(--error) bg-(--error-soft)",
  neutral: "bg-(--surface)",
  muted: "bg-(--surface)",
};

export function formatValue(value, column) {
  if (value == null) return "—";

  // console.log(column.display?.format);

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

  if (column.display?.format === "date") {
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      day: "numeric",
      month: "short",
    });
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

export function evaluateExpression(expr, row, prev = 0) {
  switch (expr.type) {
    case "constant":
      return expr.value;

    case "column": {
      const cell = row.cells[expr.columnId];
      return cell?.value ?? null;
    }

    case "unary": {
      const value = evaluateExpression(expr.arg, row, prev);
      if (value == null) return null;

      switch (expr.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case "prev": {
      return prev + row.cells[expr.columnId]?.value ?? null;
    }

    case "binary": {
      const left = evaluateExpression(expr.left, row, prev);
      const right = evaluateExpression(expr.right, row, prev);

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

export function bindGlobalPointer(from, onMove, onUp) {
  function move(e) {
    onMove(e[from]);
  }
  function up() {
    onUp();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  }
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export function evaluateColorRules(value, rules = []) {
  for (const rule of rules) {
    const fn = filterOperationMap[rule.operator];
    if (!fn) continue;

    const match = fn(value, rule.value, rule?.value2);
    if (match) return rule.color;
  }

  return null;
}
