import { SCHEMA_FUNCTIONS } from "./schema";
import { BASE_FUNCTIONS } from "./base";
import { WINDOW_FUNCTIONS } from "./window";
import { CONDITION_FUNCTIONS } from "./condition";
import { RATIO_FUNCTIONS } from "./ratio";
import { GLOBAL_FUNCTIONS } from "./global";
import { DURATION_FUNCTIONS } from "./duration";

export const FUNCTION_REGISTRY = {
  /* ---------- BASE / ROW ---------- */
  ...BASE_FUNCTIONS,

  /* ---------- WINDOW / ROLLING ---------- */
  ...WINDOW_FUNCTIONS,

  ...SCHEMA_FUNCTIONS,

  /* ---------- RATIO ---------- */
  ...RATIO_FUNCTIONS,

  /* ---------- CONDITIONAL ---------- */
  ...CONDITION_FUNCTIONS,

  ...GLOBAL_FUNCTIONS,

  ...DURATION_FUNCTIONS,
};

export const FUNCTION_ALLOW_BY_MODE = {
  /* ---------------------------------- */
  /* Row-level column                   */
  /* ---------------------------------- */
  BASE: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
    ...Object.keys(DURATION_FUNCTIONS),
    "COUNT_ALL",
  ]),

  /* ---------------------------------- */
  /* Rolling column                     */
  /* ---------------------------------- */
  WINDOW: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(SCHEMA_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
    ...Object.keys(WINDOW_FUNCTIONS),
    ...Object.keys(DURATION_FUNCTIONS),
    "COUNT_ALL",
  ]),

  // /* ---------------------------------- */
  // /* Ratio / derived row column         */
  // /* ---------------------------------- */
  RATIO: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
    ...Object.keys(RATIO_FUNCTIONS),
    ...Object.keys(DURATION_FUNCTIONS),
    "COUNT_ALL",
  ]),

  /* ---------------------------------- */
  /* Full-sequence aggregate (charts)   */
  /* ---------------------------------- */
  GLOBAL: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
    ...Object.keys(RATIO_FUNCTIONS),
    ...Object.keys(GLOBAL_FUNCTIONS),
    ...Object.keys(DURATION_FUNCTIONS),
  ]),
};
