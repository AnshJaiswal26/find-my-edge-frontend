import { FUNCTION_REGISTRY } from "../functions/registry";

/* -------------------------------------------------- */
/* helpers                                            */
/* -------------------------------------------------- */

const num = (v) => ({ value: v, valueType: "number" });
const date = (v) => ({ value: v, valueType: "date" });
const time = (v) => ({ value: v, valueType: "time" });
const datetime = (v) => ({ value: v, valueType: "datetime" });
const duration = (v) => ({ value: v, valueType: "duration" });
const bool = (v) => ({ value: v, valueType: "boolean" });
const text = (v) => ({ value: v, valueType: "text" });

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
/* binary operators (FULL MATRIX)                     */
/* -------------------------------------------------- */

function applyBinaryOp(op, l, r) {
  const L = l.valueType;
  const R = r.valueType;

  switch (op) {
    /* ---------- ADD ---------- */
    case "+":
      if (L === "number" && R === "number") return num(l.value + r.value);

      if (L === "date" && R === "duration") return date(l.value + r.value);

      if (L === "datetime" && R === "duration")
        return datetime(l.value + r.value);

      if (L === "time" && R === "duration") return time(l.value + r.value);

      if (L === "text" && R === "text") return text(l.value + r.value);

      break;

    /* ---------- SUB ---------- */
    case "-":
      if (L === "number" && R === "number") return num(l.value - r.value);

      if (L === "date" && R === "date") return duration(l.value - r.value);

      if (L === "datetime" && R === "datetime")
        return duration(l.value - r.value);

      if (L === "time" && R === "time") {
        console.log(l.value - r.value);
        return duration(l.value - r.value);
      }

      if (L === "date" && R === "duration") return date(l.value - r.value);

      if (L === "datetime" && R === "duration")
        return datetime(l.value - r.value);

      if (L === "time" && R === "duration") return time(l.value - r.value);

      break;

    /* ---------- MUL ---------- */
    case "*":
      if (L === "number" && R === "number") return num(l.value * r.value);

      if (L === "duration" && R === "number")
        return duration(l.value * r.value);

      if (L === "number" && R === "duration")
        return duration(l.value * r.value);

      break;

    /* ---------- DIV ---------- */
    case "/":
      if (L === "number" && R === "number" && r.value !== 0)
        return num(l.value / r.value);

      if (L === "duration" && R === "number" && r.value !== 0)
        return duration(l.value / r.value);

      if (L === "duration" && R === "duration" && r.value !== 0)
        return num(l.value / r.value);

      break;

    /* ---------- COMPARISONS ---------- */
    case ">":
    case "<":
    case ">=":
    case "<=":
    case "==":
    case "!=":
      if (L === R) return bool(compare(op, l.value, r.value));
  }

  return null; // ❌ illegal operation
}

function compare(op, a, b) {
  switch (op) {
    case ">":
      return a > b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    case "==":
      return a === b;
    case "!=":
      return a !== b;
  }
}

/* -------------------------------------------------- */
/* unary operators                                    */
/* -------------------------------------------------- */

function applyUnary(op, arg) {
  if (
    op === "-" &&
    (arg.valueType === "number" || arg.valueType === "duration")
  ) {
    return { value: -arg.value, valueType: arg.valueType };
  }
  return null;
}

/* -------------------------------------------------- */
/* MAIN EVALUATOR                                     */
/* -------------------------------------------------- */

export function evaluateExpression(expr, row, ctx = {}) {
  switch (expr.type) {
    /* ---------- CONSTANT ---------- */
    case "constant":
      return typeof expr.value === "boolean"
        ? bool(expr.value)
        : num(expr.value);

    /* ---------- COLUMN ---------- */
    case "column": {
      const col = ctx.columnsById[expr.columnId];
      const cell = row.cells[expr.columnId];

      if (!col) return null;

      return {
        value: cell?.value ?? null,
        valueType: col.valueType,
      };
    }

    /* ---------- UNARY ---------- */
    case "unary": {
      const arg = evaluateExpression(expr.arg, row, ctx);
      if (!arg) return null;
      return applyUnary(expr.op, arg);
    }

    /* ---------- BINARY ---------- */
    case "binary": {
      const left = evaluateExpression(expr.left, row, ctx);
      const right = evaluateExpression(expr.right, row, ctx);
      if (!left || !right) return null;
      return applyBinaryOp(expr.op, left, right);
    }

    /* ---------- FUNCTION ---------- */
    case "function": {
      const entry = FUNCTION_REGISTRY[expr.name.toUpperCase()];
      if (!entry?.exec) return null;

      return entry.exec(expr, row, ctx);
    }

    default:
      return null;
  }
}
