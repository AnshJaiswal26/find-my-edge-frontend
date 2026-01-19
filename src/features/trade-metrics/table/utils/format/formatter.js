import { formatDate } from "./date";
import { numberFormatters } from "./number";
import { formatTime } from "./time";

export const DEFAULTS_FORMATS = {
  number: "NUMBER",
  text: "",
  select: "",
  time: "hh:mm:ss A",
  date: "YYYY-MM-DD",
  "number computed": "NUMBER",
  "time computed": "HH:mm:ss",
  "date computed": "YYYY-MM-DD",
};

export function formatValue(value, type, display) {
  const format = display?.format;
  const decimals = display?.decimals ?? 0;

  // ---------- null / invalid ----------
  if (value === null || value === undefined) return "—";

  try {
    // ---------- NUMBER & COMPUTED ----------
    if (type === "number" || type === "number computed") {
      let num = Number(value);
      if (typeof num !== "number" || !Number.isFinite(num)) num = 0;

      const formatter = numberFormatters[format] || numberFormatters.NUMBER;
      return formatter(num, decimals);
    }

    // ---------- DATE ----------
    if (type === "date" || type === "date computed") {
      return formatDate(value, format);
    }

    // ---------- TIME ----------
    if (type === "time" || type === "time computed") {
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
