import { SchemaSource } from "@lib/analytics/schema";
import { computeAggregate } from "./computeAggregate";
import { computeRowSequence } from "./computeRowSequence";
import { COMPUTATION_MODE } from "./computionModes";

export function computeOverSequence(options) {
  // Global / Ratio expression
  if (options.mode === COMPUTATION_MODE.AGGREGATE) {
    // console.log(options);
    return computeAggregate(options);
  }

  if (options.schema?.source !== SchemaSource.COMPUTED) return;
  // console.log(options);

  // Row / Window evaluation
  return computeRowSequence(options);
}
