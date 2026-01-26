import { splitIntoBuckets } from "./buckets";

export const draftToSpec = (draft) => {
  if (draft.kind === "value") {
    return { type: "value", key: draft.key };
  }

  if (draft.kind === "bucket") {
    if (["day", "month", "year"].includes(draft.bucket)) {
      return { type: "dateBucket", key: draft.key, unit: draft.bucket };
    }

    if (draft.bucket === "hour") {
      return { type: "timeBucket", key: draft.key, unit: "hour" };
    }

    if (draft.bucket === "range") {
      const ranges = Array.isArray(draft.ranges)
        ? draft.ranges
        : splitIntoBuckets(draft.ranges);

      if (draft.schemaType.includes("time")) {
        return { type: "timeRange", key: draft.key, ranges };
      }
      return { type: "numberRange", key: draft.key, ranges };
    }
  }

  if (draft.kind === "condition") {
    return {
      type: "condition",
      key: draft.key,
      operator: draft.operator,
      value: draft.value,
      valueTo: draft.valueTo,
      labels: draft.labels,
    };
  }
};
