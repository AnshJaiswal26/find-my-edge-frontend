import { formatValue } from "@utils";

export function matchRange(value, ranges, labelFormatter, { type, display }) {
  if (value == null) return "Empty";

  for (const r of ranges) {
    if (value >= r.from && value <= r.to) {
      return labelFormatter(
        formatValue(r.from, type, display),
        formatValue(r.to, type, display),
      );
    }
  }

  return "Other";
}
