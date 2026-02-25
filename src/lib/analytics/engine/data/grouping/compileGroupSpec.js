import { FILTER_OPERATION_MAP } from "@shared/utils";
import { getDateBucket, getTimeBucket } from "./buckets";
import { matchRange } from "./ranges";

export function compileGroupSpec(spec, getValue) {
  switch (spec.type) {
    case "value":
      return (trade) => getValue(trade, spec.key);

    case "dateBucket":
      return (trade) => getDateBucket(getValue(trade, spec.key), spec.unit);

    case "timeBucket":
      return (trade) => getTimeBucket(getValue(trade, spec.key), spec.unit);

    case "numberRange":
      return (trade) => matchRange(getValue(trade, spec.key), spec.ranges);

    case "timeRange":
      return (trade) => matchRange(getValue(trade, spec.key), spec.ranges);

    case "condition":
      return (trade) => {
        const fn = FILTER_OPERATION_MAP[spec.operator];
        const result = fn(
          getValue(trade, spec.key),
          spec.value ?? spec.from,
          spec.to,
        );

        return result
          ? (spec.labels?.match ?? "Match")
          : (spec.labels?.nonMatch ?? "Other");
      };
  }
}
