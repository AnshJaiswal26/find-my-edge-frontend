import { FORMATS } from "@shared/utils";

export function resolveFormatGroup(format, type) {
  if (!format) return "NUMBER";

  if (type.includes("date")) {
    return "DATE";
  }

  if (type.includes("time")) {
    return "TIME";
  }

  if (FORMATS[type].some((f) => f === format)) {
    return format;
  }

  return "NUMBER";
}
