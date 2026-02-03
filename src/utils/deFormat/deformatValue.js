import { parseDateByFormat } from "./date";
import { parseTimeByFormat } from "./time";

export function deformatValue(raw, format, valueType) {
  switch (valueType) {
    case "number":
    case "number computed":
      return +raw;

    case "date":
    case "date computed": {
      return parseDateByFormat(raw, format);
    }

    case "time":
    case "time computed": {
      return parseTimeByFormat(raw, format);
    }

    default:
      return raw;
  }
}
