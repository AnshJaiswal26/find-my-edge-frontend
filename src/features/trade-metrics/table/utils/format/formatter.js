import { formatDate } from "./date";
import { numberFormatters } from "./number";
import { formatTime } from "./time";

export function formatValue(value, column) {
  const type = column.type;
  const format = column.display?.format;
  const decimals = column.display?.decimals ?? 0;

  // ---------- null / invalid ----------
  if (value === null || value === undefined) return "—";

  try {
    // ---------- NUMBER & COMPUTED ----------
    if (type === "number" || type === "computed") {
      let num = Number(value);
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
      return formatTime(value, format);
    }
  } catch {
    return "—";
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
