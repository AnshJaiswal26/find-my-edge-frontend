import { COLUMN_FUNCTIONS } from "./column/registry";
import { BASE_FUNCTIONS } from "./base/registry";
import { WINDOW_FUNCTIONS } from "./window/registry";
import { CONDITION_FUNCTIONS } from "./condition/registry";

export const FUNCTION_REGISTRY = {
  /* ---------- BASE / ROW ---------- */
  ...BASE_FUNCTIONS,

  /* ---------- COLUMN / STATE ---------- */
  ...COLUMN_FUNCTIONS,

  /* ---------- WINDOW / ROLLING ---------- */
  ...WINDOW_FUNCTIONS,

  /* ---------- CONDITIONAL ---------- */
  ...CONDITION_FUNCTIONS,
};

export const METRIC_COMPUTE_TYPE = {
  ROW: "row", // per trade (bar/line)
  GLOBAL_AGGREGATE: "globalAgg", // one value from all trades
  GLOBAL_RATIO: "globalRatio", // ratio derived from totals
  GROUP_AGGREGATE: "groupAgg", // one value per group
  GROUP_RATIO: "groupRatio", // ratio inside each group
  WINDOW_SERIES: "windowSeries", // rolling value per trade
  GROUP_WINDOW_SERIES: "groupWindowSeries", // rolling per group
  DISTRIBUTION: "distribution", // % split of categories
};
