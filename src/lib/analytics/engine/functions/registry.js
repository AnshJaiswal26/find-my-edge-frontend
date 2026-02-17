import { SCHEMA_FUNCTIONS } from "./schema/registry";
import { BASE_FUNCTIONS } from "./base/registry";
import { WINDOW_FUNCTIONS } from "./window/registry";
import { CONDITION_FUNCTIONS } from "./condition/registry";
import { RATIO_FUNCTIONS } from "./ratio";
import { GLOBAL_FUNCTIONS } from "./global/registry";
import { DURATION_FUNCTIONS } from "./duration/registry";

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
