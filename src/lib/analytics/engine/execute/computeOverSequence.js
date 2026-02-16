import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { computedAggregate } from "./computeAggregate";
import { computeRowSequence } from "./computeRowSequence";
import { COMPUTATION_MODE } from "./computionModes";

export function computeOverSequence(options) {
  // Global / Ratio expression
  if (options.mode === COMPUTATION_MODE.AGGREGATE) {
    // console.log(options);
    return computedAggregate(options);
  }

  if (options.schema?.source !== SCHEMA_SOURCE.COMPUTED) return;
  // console.log(options);

  // Row / Window evaluation
  return computeRowSequence(options);
}
