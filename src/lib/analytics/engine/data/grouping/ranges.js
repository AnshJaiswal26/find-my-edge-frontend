export function matchRange(value, ranges) {
  if (value == null) return { type: "EMPTY" };

  for (const r of ranges) {
    if (value >= r.from && value <= r.to) {
      return {
        type: "RANGE",
        from: r.from,
        to: r.to,
      };
    }
  }

  return { type: "OTHER" };
}
