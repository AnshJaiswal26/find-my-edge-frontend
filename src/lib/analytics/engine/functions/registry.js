import { COLUMN_FUNCTIONS } from "./column/registry";
import { BASE_FUNCTIONS } from "./base/registry";
import { WINDOW_FUNCTIONS } from "./window/registry";
import { CONDITION_FUNCTIONS } from "./condition/registry";
import { RATIO_FUNCTIONS } from "./ratio";

export const FUNCTION_REGISTRY = {
  /* ---------- BASE / ROW ---------- */
  ...BASE_FUNCTIONS,

  /* ---------- COLUMN / STATE ---------- */
  ...COLUMN_FUNCTIONS,

  /* ---------- WINDOW / ROLLING ---------- */
  ...WINDOW_FUNCTIONS,

  /* ---------- RATIO ---------- */
  ...RATIO_FUNCTIONS,

  /* ---------- CONDITIONAL ---------- */
  ...CONDITION_FUNCTIONS,
};

export const METRIC_COMPUTE_TYPE = {
  ROW: "row", // one output per trade (no history)
  SEQUENCE_AGGREGATE: "seqAgg", // one value from a sequence of trades
  SEQUENCE_RATIO: "seqRatio", // ratio derived from sequence totals
  WINDOW_SERIES: "windowSeries", // rolling value per trade
  DISTRIBUTION: "distribution", // category % split over a sequence
};
