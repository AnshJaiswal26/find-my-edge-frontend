import { splitIntoBuckets } from "./buckets";

export const draftToSpec = (draft) => {
  if (!draft) return null;

  if (draft.kind === "value") {
    return { type: "value", key: draft.key, ast: draft?.ast };
  }

  if (draft.kind === "bucket") {
    if (["day", "month", "year"].includes(draft.bucket)) {
      return {
        type: "dateBucket",
        key: draft.key,
        unit: draft.bucket,
        ast: draft?.ast,
      };
    }

    if (draft.bucket === "hour") {
      return {
        type: "timeBucket",
        key: draft.key,
        unit: "hour",
        ast: draft?.ast,
      };
    }

    if (draft.bucket === "range") {
      const ranges = Array.isArray(draft.ranges)
        ? draft.ranges
        : splitIntoBuckets(draft.ranges);

      if (draft.schemaType.includes("time")) {
        return { type: "timeRange", key: draft.key, ranges, ast: draft?.ast };
      }
      return { type: "numberRange", key: draft.key, ranges, ast: draft?.ast };
    }
  }

  if (draft.kind === "condition") {
    return {
      type: "condition",
      key: draft.key,
      operator: draft.operator,
      value: draft.value,
      from: draft.from,
      to: draft.to,
      labels: draft.labels,
      ast: draft?.ast,
    };
  }
};
