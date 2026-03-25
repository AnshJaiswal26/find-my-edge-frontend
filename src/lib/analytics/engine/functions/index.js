import { MATH_FUNCTIONS } from "./math";
import { LOGICAL_FUNCTIONS } from "./logical";
import { WINDOW_FUNCTIONS } from "./window";
import { AGGREGATE_FUNCTIONS } from "./aggregate";
import { SCHEMA_FUNCTIONS } from "./schema";
import { DURATION_FUNCTIONS } from "./duration";
import { NATIVE_AGGREGATE_FUNCTIONS } from "./native";

export const FUNCTION_REGISTRY = {
  /* ---------- MATH ---------- */
  ...MATH_FUNCTIONS,

  /* ---------- LOGICAL ---------- */
  ...LOGICAL_FUNCTIONS,

  /* ---------- WINDOW / ROLLING ---------- */
  ...WINDOW_FUNCTIONS,

  /* ---------- AGGREGATE ---------- */
  ...AGGREGATE_FUNCTIONS,

  ...NATIVE_AGGREGATE_FUNCTIONS,

  /* ---------- SCHEMA ---------- */
  ...SCHEMA_FUNCTIONS,

  /* ---------- TIME ---------- */
  ...DURATION_FUNCTIONS,
};

const BASE_FUNCTIONS = [
  ...Object.keys(MATH_FUNCTIONS),
  ...Object.keys(DURATION_FUNCTIONS),
  ...Object.keys(LOGICAL_FUNCTIONS),
];

export const FUNCTIONS_ALLOWED_BY_MODE = {
  BASE: new Set([...BASE_FUNCTIONS, "COUNT_ALL"]),

  WINDOW: new Set([
    ...BASE_FUNCTIONS,
    ...Object.keys(SCHEMA_FUNCTIONS),
    ...Object.keys(WINDOW_FUNCTIONS),
    "COUNT_ALL",
  ]),

  AGGREGATE: new Set([
    ...BASE_FUNCTIONS,
    ...Object.keys(AGGREGATE_FUNCTIONS),
    ...Object.keys(NATIVE_AGGREGATE_FUNCTIONS),
  ]),
};

const META_KEYS = new Set([
  "args",
  "returnType",
  "signature",
  "description",
  "type",
  "executionMode",
  "generics",
  "strategy",
]);

function extractMeta(fn) {
  return Object.fromEntries(
    Object.entries(fn).filter(([key]) => META_KEYS.has(key)),
  );
}

export function buildFunctionMetaRegistry(registry) {
  return Object.fromEntries(
    Object.entries(registry).map(([name, fn]) => [name, extractMeta(fn)]),
  );
}

// console.log(
//   JSON.stringify(buildFunctionMetaRegistry(FUNCTION_REGISTRY), null, 2),
// );
//
// console.log(
//   JSON.stringify(
//     Object.fromEntries(
//       Object.entries(FUNCTIONS_ALLOWED_BY_MODE).map(([mode, set]) => [
//         mode,
//         Array.of(...set),
//       ]),
//     ),
//   ),
// );
