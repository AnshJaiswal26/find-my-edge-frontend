import { parseDateByFormat } from "./date";
import { parseTimeByFormat } from "./time";

export function parseDateTimeByFormat(str, format) {
  if (!str) return null;

  const parts = str.trim().split(" ");

  // Try splitting date + time
  if (parts.length < 2) return null;

  const datePart = parts.slice(0, 1).join(" ");
  const timePart = parts.slice(1).join(" ");

  // Extract format parts
  const [dateFormat, timeFormat] = format.split(" ");

  const days = parseDateByFormat(datePart, dateFormat);
  const seconds = parseTimeByFormat(timePart, timeFormat);

  if (days == null || seconds == null) return null;

  return days * 86400 + seconds;
}
