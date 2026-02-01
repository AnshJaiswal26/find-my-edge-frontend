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

