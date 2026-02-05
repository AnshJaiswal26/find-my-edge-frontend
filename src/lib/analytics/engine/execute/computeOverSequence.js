import { computedAggregate } from "./computeAggregate";
import { computeRowSequence } from "./computeRowSequence";
import { COMPUTATION_MODE } from "./computionModes";

export function computeOverSequence(options) {
  // Global / Ratio expression
  if (options.mode === COMPUTATION_MODE.AGGREGATE) {
    // console.log(options);
    return computedAggregate(options);
  }

  if (!options.schema?.type?.includes("computed")) return;
  // console.log(options);

  // Row / Window evaluation
  return computeRowSequence(options);
}
