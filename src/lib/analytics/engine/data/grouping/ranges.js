export function matchRange(value, ranges, labelFormatter) {
  if (value == null) return "Empty";

  for (const r of ranges) {
    if (value >= r.from && value <= r.to) {
      return labelFormatter(r.from, r.to);
    }
  }

  return "Other";
}
 