import { FUNCTION_REGISTRY } from "../functions/registry";

/* -------------------------------------------------- */
/* helpers                                            */
/* -------------------------------------------------- */

export function parseInputValue(raw, valueType) {
  if (raw == null || raw === "") return null;

  switch (valueType) {
    case "number":
      return +raw;

    case "date": {
      // YYYY-MM-DD → days since epoch
      const ms = Date.parse(raw + "T00:00:00Z");
      return Math.floor(ms / 86400000);
    }

    case "time": {
      // HH:mm[:ss] → seconds since midnight
      const [h, m, s = 0] = raw.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    }

    case "datetime": {
      return Date.parse(raw);
    }

    case "duration":
      return +raw; // seconds or minutes (your choice)

    case "boolean":
      return raw === "true" || raw === true;

    default:
      return raw;
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function formatForInput(value, valueType) {
  if (value == null || value === "" || Number.isNaN(value)) return "";

  switch (valueType) {
    case "date": {
      // days → YYYY-MM-DD
      const ms = value * 86400000;
      return new Date(ms).toISOString().slice(0, 10);
    }

    case "time": {
      // seconds → HH:mm:ss
      const h = Math.floor(value / 3600);
      const m = Math.floor((value % 3600) / 60);
      const s = value % 60;
      return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    }

    case "number":
      return String(value);

    default:
      return String(value);
  }
}

/* -------------------------------------------------- */
/* MAIN EVALUATOR                                     */
/* -------------------------------------------------- */

export function evaluateExpression(expr, row, ctx = {}) {
  switch (expr.type) {
    case "constant":
      return expr.value;

    case "column": {
      const cell = row.cells[expr.columnId];
      return cell?.value ?? null;
    }

    case "unary": {
      const value = evaluateExpression(expr.arg, row, ctx);
      if (value == null) return null;

      switch (expr.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case "binary": {
      const left = evaluateExpression(expr.left, row, ctx);
      const right = evaluateExpression(expr.right, row, ctx);

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

        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        case "==":
          return left === right;
        case "!=":
          return left !== right;

        default:
          return null;
      }
    }

    case "function": {
      const entry = FUNCTION_REGISTRY[expr.name.toUpperCase()];
      if (!entry?.exec) return null;

      return entry.exec(expr, row, ctx);
    }

    default:
      return null;
  }
}
