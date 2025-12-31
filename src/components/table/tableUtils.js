import { filterOperationMap } from "@utils";

export const DATE_FORMATS = [
  { key: "DD MMM YYYY", label: "15 Apr 2025" },
  { key: "DD/MM/YYYY", label: "15/04/2025" },
  { key: "MM/DD/YYYY", label: "04/15/2025" },
  { key: "YYYY-MM-DD", label: "2025-04-15" },
  { key: "DD-MM-YY", label: "15-04-25" },
  { key: "DD-MM-YYYY", label: "15-04-2025" },
  { key: "MMM DD, YYYY", label: "Apr 15, 2025" },
  { key: "DD MMM", label: "15 Apr" },
  { key: "MMM YYYY", label: "Apr 2025" },
];

export const NUMBER_FORMATS = [
  { key: "number", label: "123.45" },
  { key: "integer", label: "123" },

  { key: "currency", label: "₹1,250" },
  { key: "currency-signed", label: "+₹450 / -₹300" },

  { key: "percent", label: "12%" },
  { key: "percent-signed", label: "+3.2% / -1.5%" },

  { key: "ratio", label: "1:2" },
  { key: "ratio-x", label: "2.5x" },

  { key: "compact", label: "1.2L / 120K" },
];

export const TIME_FORMATS = [
  { key: "HH:mm", label: "09:30" },
  { key: "HH:mm:ss", label: "09:30:15" },
  { key: "hh:mm A", label: "09:30 AM" },
  { key: "hh:mm:ss A", label: "09:30:15 AM" },
  { key: "mm:ss", label: "05:32" },
];

export function formatDate(value, format) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  const map = {
    YYYY: d.getFullYear(),
    YY: String(d.getFullYear()).slice(-2),
    MM: String(d.getMonth() + 1).padStart(2, "0"),
    DD: String(d.getDate()).padStart(2, "0"),
    MMM: d.toLocaleString("en-IN", { month: "short" }),
    MMMM: d.toLocaleString("en-IN", { month: "long" }),
    ddd: d.toLocaleString("en-IN", { weekday: "short" }),
    dddd: d.toLocaleString("en-IN", { weekday: "long" }),
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|DD|dddd|ddd/g, (k) => map[k]);
}

const numberFormatters = {
  number: (v, d = 2) => v.toFixed(d),

  integer: (v) => Math.round(v).toString(),

  currency: (v, d = 0) => `₹${v.toFixed(d)}`,

  "currency-signed": (v, d = 0) =>
    `${v >= 0 ? "+" : "-"}₹${Math.abs(v).toFixed(d)}`,

  percent: (v, d = 0) => `${v.toFixed(d)}%`,

  "percent-signed": (v, d = 0) =>
    `${v >= 0 ? "+" : "-"}${Math.abs(v).toFixed(d)}%`,

  ratio: (v, d = 0) => `1:${v.toFixed(d)}`,

  "ratio-x": (v, d = 2) => `${v.toFixed(d)}x`,
};

export function formatTime(value, format) {
  if (!value) return "—";

  const [h, m, s = "00"] = value.split(":");

  const hour = Number(h);
  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";

  const map = {
    HH: h.padStart(2, "0"),
    hh: String(hour12).padStart(2, "0"),
    mm: m.padStart(2, "0"),
    ss: s.padStart(2, "0"),
    A: ampm,
  };

  return format.replace(/HH|hh|mm|ss|A/g, (k) => map[k]);
}

export function formatValue(value, column) {
  const type = column.type;
  const format = column.display?.format;
  const decimals = column.display?.decimals ?? 0;

  // ---------- null / invalid ----------
  if (value === null || value === undefined) return "—";

  // ---------- NUMBER & COMPUTED ----------
  if (type === "number" || type === "computed") {
    let num = value;
    if (typeof num !== "number" || !Number.isFinite(num)) num = 0;

    const formatter = numberFormatters[format] || numberFormatters["number"];
    return formatter(num, decimals);
  }

  // ---------- DATE ----------
  if (type === "date") {
    return formatDate(value, format);
  }

  // ---------- TIME ----------
  if (type === "time") {
    console.log("Formatting time:", value, format);
    return formatTime(value, format);
  }

  // ---------- SELECT ----------
  if (type === "select") {
    // value is usually already a label
    return String(value);
  }

  // ---------- TEXT ----------
  if (type === "text") {
    return String(value);
  }

  // ---------- FALLBACK ----------
  return String(value);
}

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

export function getInitialCellValue(column) {
  switch (column.type) {
    case "number":
    case "computed":
      return 0;
    case "date":
      return new Date().toISOString().slice(0, 10);
    case "text":
      return "-";
    case "select":
      return "";
    default:
      return null;
  }
}

export function createTrade(columnsById) {
  const cells = {};

  Object.values(columnsById).forEach((column) => {
    let value = getInitialCellValue(column);

    cells[column.id] = {
      value,
      meta: {},
    };
  });

  return {
    id: crypto.randomUUID(),
    cells,
  };
}

export function buildAffectedMap(columnsById) {
  const affected = {};

  Object.values(columnsById).forEach((col) => {
    col.dependsOn?.forEach((dep) => {
      if (!affected[dep]) affected[dep] = [];
      affected[dep].push(col.id);
    });
  });

  return affected;
}

export function computeCumulativeColumn(rowsById, rowOrder, column) {
  if (column.type !== "computed" || !usesPrev(column.expression)) return;

  const rows = rowOrder.map((id) => rowsById[id]);

  let prevSelf = column.startValue ?? 0;

  rows.forEach((row) => {
    const value = evaluateExpression(column.expression, row, prevSelf);
    row.cells[column.id].value = value;
    prevSelf = value;
  });
}

export function computeAffectedRowCascade(
  row,
  changedColId,
  columnsById,
  affectedMap,
  rowsById,
  rowOrder
) {
  const queue = [changedColId];
  const visited = new Set();

  while (queue.length) {
    const colId = queue.shift();
    affectedMap[colId]?.forEach((nextColId) => {
      if (visited.has(nextColId)) return;
      visited.add(nextColId);

      const column = columnsById[nextColId];

      if (usesPrev(column.expression)) {
        computeCumulativeColumn(rowsById, rowOrder, column);
      } else {
        const value = evaluateExpression(column.expression, row);
        row.cells[nextColId].value = value;
      }

      queue.push(nextColId);
    });
  }
}

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
