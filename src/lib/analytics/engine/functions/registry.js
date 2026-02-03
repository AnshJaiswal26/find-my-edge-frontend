import { COLUMN_FUNCTIONS } from "./column/registry";
import { BASE_FUNCTIONS } from "./base/registry";
import { WINDOW_FUNCTIONS } from "./window/registry";
import { CONDITION_FUNCTIONS } from "./condition/registry";
import { RATIO_FUNCTIONS } from "./ratio";
import { GLOBAL_FUNCTIONS } from "./global/registry";

export const FUNCTION_REGISTRY = {
  /* ---------- BASE / ROW ---------- */
  ...BASE_FUNCTIONS,

  /* ---------- WINDOW / ROLLING ---------- */
  ...WINDOW_FUNCTIONS,

  /* ---------- RATIO ---------- */
  ...RATIO_FUNCTIONS,

  /* ---------- CONDITIONAL ---------- */
  ...CONDITION_FUNCTIONS,

  ...GLOBAL_FUNCTIONS,
};

export const FUNCTION_ALLOW_BY_MODE = {
  /* ---------------------------------- */
  /* Row-level column                   */
  /* ---------------------------------- */
  BASE: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
  ]),

  /* ---------------------------------- */
  /* Rolling column                     */
  /* ---------------------------------- */
  WINDOW: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
    ...Object.keys(WINDOW_FUNCTIONS),
  ]),

  // /* ---------------------------------- */
  // /* Ratio / derived row column         */
  // /* ---------------------------------- */
  // RATIO: new Set([
  //   ...Object.keys(BASE_FUNCTIONS),
  //   ...Object.keys(CONDITION_FUNCTIONS),
  //   ...Object.keys(RATIO_FUNCTIONS),
  // ]),

  /* ---------------------------------- */
  /* Full-sequence aggregate (charts)   */
  /* ---------------------------------- */
  GLOBAL: new Set([
    ...Object.keys(BASE_FUNCTIONS),
    ...Object.keys(CONDITION_FUNCTIONS),
    ...Object.keys(RATIO_FUNCTIONS),
    ...Object.keys(GLOBAL_FUNCTIONS),
  ]),
};
