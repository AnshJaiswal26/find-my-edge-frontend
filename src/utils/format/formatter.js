import { DATE_FORMAT_KEYS, formatDate } from "./date";
import { NUMBER_FORMAT_KEYS, numberFormatters } from "./number";
import { formatTime, TIME_FORMAT_KEYS } from "./time";
import { formatDuration, DURATION_FORMAT_KEYS } from "./duration";
import { DATETIME_FORMAT_KEYS, formatDateTime } from "./datetime";

const DEFAULT_FORMATS = {
  number: "NUMBER",
  string: "TEXT",
  boolean: "TRUE_FALSE",

  date: "YYYY-MM-DD",
  time: "hh:mm:ss A",
  datetime: "YYYY-MM-DD hh:mm:ss A",

  duration: "HH:mm:ss",
};

const FORMATS = {
  number: NUMBER_FORMAT_KEYS,
  string: ["TEXT", "UPPERCASE", "LOWERCASE"],
  boolean: ["TRUE_FALSE", "YES_NO"],

  date: DATE_FORMAT_KEYS,
  time: TIME_FORMAT_KEYS,
  datetime: DATETIME_FORMAT_KEYS,

  duration: DURATION_FORMAT_KEYS,
};

function formatValue(value, semantic, display) {
  const format = display.format || DEFAULT_FORMATS[semantic];
  const decimals = display.decimals ?? 0;

  // ---------- null / invalid ----------
  if (value === null || value === undefined) return "—";

  try {
    switch (semantic) {
      /* ---------- NUMBER ---------- */
      case "number": {
        let num = Number(value);
        if (!Number.isFinite(num)) num = 0;

        const formatter = numberFormatters[format] || numberFormatters.NUMBER;

        return formatter(num, decimals, display);
      }

      /* ---------- DATE ---------- */
      case "date":
        return formatDate(value, format);

      /* ---------- TIME ---------- */
      case "time":
        return formatTime(value, format);

      /* ---------- DATETIME ---------- */
      case "datetime": {
        return formatDateTime(value, format);
      }

      /* ---------- DURATION ---------- */
      case "duration":
        return formatDuration(value, format);

      /* ---------- BOOLEAN ---------- */
      case "boolean":
        if (format === "YES_NO") return value ? "Yes" : "No";
        return value ? "True" : "False";

      /* ---------- STRING ---------- */
      case "string": {
        const str = String(value);

        if (format === "UPPERCASE") return str.toUpperCase();
        if (format === "LOWERCASE") return str.toLowerCase();

        return str;
      }

      default:
        return String(value);
    }
  } catch (err) {
    return "—";
  }
}

export { DEFAULT_FORMATS, FORMATS, formatValue };
