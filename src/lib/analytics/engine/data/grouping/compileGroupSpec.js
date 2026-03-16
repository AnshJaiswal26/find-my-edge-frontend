import { FILTER_OPERATION_MAP } from "@shared/utils";
import { getDateBucket, getTimeBucket } from "./buckets";
import { matchRange } from "./ranges";

export function compileGroupSpec(spec, getValue) {
  switch (spec.type) {
    case "value":
      return (id) => getValue(id, spec.field);

    case "dateBucket":
      return (id) => getDateBucket(getValue(id, spec.field), spec.unit);

    case "timeBucket":
      return (id) => getTimeBucket(getValue(id, spec.field), spec.unit);

    case "numberRange":
      return (id) => matchRange(getValue(id, spec.field), spec.ranges);

    case "timeRange":
      return (id) => matchRange(getValue(id, spec.field), spec.ranges);

    case "condition":
      return (id) => {
        const fn = FILTER_OPERATION_MAP[spec.operator];
        const result = fn(
          getValue(id, spec.field),
          spec.value ?? spec.from,
          spec.to,
        );

        return result
          ? (spec.labels?.match ?? "Match")
          : (spec.labels?.nonMatch ?? "Other");
      };
  }
}
