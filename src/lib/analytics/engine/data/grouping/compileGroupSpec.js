import { FILTER_OPERATION_MAP, formatValue } from "@utils";
import { getDateBucket, getTimeBucket } from "./buckets";
import { matchRange } from "./ranges";

export function compileGroupSpec(spec, getValue, getFormat) {
  switch (spec.type) {
    case "value":
      return (trade, { type, display }) => {
        const value = getValue(trade, spec.key);
        if (value) {
          return formatValue(value, type, display);
        }
        return "Empty";
      };

    case "dateBucket":
      return (trade, format) =>
        getDateBucket(getValue(trade, spec.key), spec.unit, format);

    case "timeBucket":
      return (trade, format) =>
        getTimeBucket(getValue(trade, spec.key), spec.unit, format);

    case "numberRange":
      return (trade, format) =>
        matchRange(
          getValue(trade, spec.key),
          spec.ranges,
          (f, t) => `${f} – ${t}`,
          format,
        );

    case "timeRange":
      return (trade, format) =>
        matchRange(
          getValue(trade, spec.key),
          spec.ranges,
          (f, t) => `${f} – ${t}`,
          format,
        );

    case "condition":
      return (trade, { type, display }) => {
        const fn = FILTER_OPERATION_MAP[spec.operator];
        const result = fn(getValue(trade, spec.key), spec.value, spec.valueTo);

        return result
          ? (spec.labels?.match ?? "Match")
          : (spec.labels?.nonMatch ?? "Other");
      };
  }
}
