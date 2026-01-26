import { FILTER_OPERATION_MAP } from "@utils";
import { getDateBucket, getTimeBucket } from "./buckets";
import { matchRange } from "./ranges";

export function compileGroupSpec(spec, getValue) {
  switch (spec.type) {
    case "value":
      return (trade) => getValue(trade, spec.key) ?? "Empty";

    case "dateBucket":
      return (trade) => getDateBucket(getValue(trade, spec.key), spec.unit);

    case "timeBucket":
      return (trade) => getTimeBucket(getValue(trade, spec.key), spec.unit);

    case "numberRange":
      return (trade) =>
        matchRange(
          getValue(trade, spec.key),
          spec.ranges,
          (f, t) => `${f} – ${t}`,
        );

    case "timeRange":
      return (trade) =>
        matchRange(
          getValue(trade, spec.key),
          spec.ranges,
          (f, t) => `${f}–${t} min`,
        );

    case "condition":
      return (trade) => {
        const fn = FILTER_OPERATION_MAP[spec.operator];
        const result = fn(getValue(trade, spec.key), spec.value, spec.valueTo);

        return result
          ? (spec.labels?.match ?? "Match")
          : (spec.labels?.nonMatch ?? "Other");
      };
  }
}
