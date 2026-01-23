import { DATE_FORMAT_KEYS, formatDate } from "./date";
import { NUMBER_FORMAT_KEYS, numberFormatters } from "./number";
import { formatTime, TIME_FORMAT_KEYS } from "./time";

export const DEFAULT_FORMATS = {
  number: "NUMBER",
  text: "",
  select: "",
  time: "hh:mm:ss A",
  date: "YYYY-MM-DD",
  "number computed": "NUMBER",
  "time computed": "HH:mm:ss",
  "date computed": "YYYY-MM-DD",
};

export const FORMATS = {
  number: NUMBER_FORMAT_KEYS,
  "number computed": NUMBER_FORMAT_KEYS,
  time: TIME_FORMAT_KEYS,
  date: DATE_FORMAT_KEYS,
  "time computed": [TIME_FORMAT_KEYS[0], TIME_FORMAT_KEYS[1]],
  "date computed": DATE_FORMAT_KEYS,
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
