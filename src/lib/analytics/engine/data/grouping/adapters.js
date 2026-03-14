import { splitIntoBuckets } from "./buckets";

export const draftToSpec = (draft) => {
  if (!draft) return null;

  if (draft.kind === "value") {
    return { type: "value", field: draft.field };
  }

  if (draft.kind === "bucket") {
    if (["day", "month", "year"].includes(draft.bucket)) {
      return {
        type: "dateBucket",
        field: draft.field,
        unit: draft.bucket,
      };
    }

    if (draft.bucket === "hour") {
      return {
        type: "timeBucket",
        field: draft.field,
        unit: "hour",
      };
    }

    if (draft.bucket === "range") {
      const ranges = Array.isArray(draft.ranges)
        ? draft.ranges
        : splitIntoBuckets(draft.ranges);

      if (draft.schemaType.includes("time")) {
        return { type: "timeRange", field: draft.field, ranges };
      }
      return { type: "numberRange", field: draft.field, ranges };
    }
  }

  if (draft.kind === "condition") {
    return {
      type: "condition",
      field: draft.field,
      operator: draft.operator,
      value: draft.value,
      from: draft.from,
      to: draft.to,
      labels: draft.labels,
    };
  }
};
