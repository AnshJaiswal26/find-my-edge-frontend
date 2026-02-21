import { formatDate, formatValue } from "@shared/utils";

function adjustDateFormat(format, unit) {
  if (!format) return format;

  let f = format;

  if (unit === "month") {
    // remove only DD
    f = f.replace(/DD/g, "");
  }

  if (unit === "year") {
    // remove DD and month tokens
    f = f.replace(/DD/g, "").replace(/MMMM|MMM|MM/g, "");
  }

  // 🔥 cleanup double separators (IMPORTANT)
  f = f
    .replace(/--+/g, "-") // "--" → "-"
    .replace(/\/\/+/g, "/") // "//" → "/"
    .replace(/,\s*,+/g, ",") // ",," → ","
    .replace(/[-\/,]+$/g, "") // trailing separators
    .replace(/^[-\/,]+/g, "") // leading separators
    .replace(/\s{2,}/g, " ") // extra spaces
    .replace(/\s+,/g, ",")
    .replace(/,\s+/g, ", ")
    .trim();

  return f;
}

export function formatGroupValue(meta, type, display) {
  if (!meta) return "";

  /* ------------------ PRIMITIVE ------------------ */
  if (typeof meta !== "object") {
    return formatValue(meta, type, display);
  }

  /* ------------------ DATE ------------------ */
  if (meta.type === "DATE_BUCKET") {
    const format = adjustDateFormat(display?.format, meta.unit);
    return formatDate(meta.value, format); // single line
  }

  /* ------------------ TIME ------------------ */
  if (meta.type === "TIME_BUCKET") {
    return formatValue(meta.value, "time", display);
  }

  /* ------------------ RANGE ------------------ */
  if (meta.type === "RANGE") {
    return `${formatValue(meta.from, type, display)} – ${formatValue(meta.to, type, display)}`;
  }

  /* ------------------ FALLBACK ------------------ */
  return String(meta.type);
}
