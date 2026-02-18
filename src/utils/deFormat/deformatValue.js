import { parseDateByFormat } from "./date";
import { parseTimeByFormat } from "./time";
import { parseDurationByFormat } from "./duration";
import { parseDateTimeByFormat } from "./datetime";

export function deformatValue(raw, format, valueType) {
  switch (valueType) {
    case "number":
      return +raw;

    case "date":
      return parseDateByFormat(raw, format);

    case "time":
      return parseTimeByFormat(raw, format);

    case "duration":
      return parseDurationByFormat(raw, format);

    case "datetime":
      return parseDateTimeByFormat(raw, format);

    default:
      return raw;
  }
}
