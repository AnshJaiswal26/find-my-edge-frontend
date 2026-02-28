import { MathFunctions } from "./math";
import { LogicalFunctions } from "./logical";
import { WindowFunctions } from "./window";
import { AggregateFunctions } from "./aggregate";
import { SchemaFunctions } from "./schema";
import { DurationFunctions } from "./duration";
import { NativeAggregateFunctions } from "./native";

export const FunctionRegistry = {
  /* ---------- MATH ---------- */
  ...MathFunctions,

  /* ---------- LOGICAL ---------- */
  ...LogicalFunctions,

  /* ---------- WINDOW / ROLLING ---------- */
  ...WindowFunctions,

  /* ---------- AGGREGATE ---------- */
  ...AggregateFunctions,

  ...NativeAggregateFunctions,

  /* ---------- SCHEMA ---------- */
  ...SchemaFunctions,

  /* ---------- TIME ---------- */
  ...DurationFunctions,
};

const BASE_FUNCS = [
  ...Object.keys(MathFunctions),
  ...Object.keys(DurationFunctions),
  ...Object.keys(LogicalFunctions),
];

export const FunctionAllowByMode = {
  BASE: new Set([...BASE_FUNCS, "COUNT_ALL"]),

  WINDOW: new Set([
    ...BASE_FUNCS,
    ...Object.keys(SchemaFunctions),
    ...Object.keys(WindowFunctions),
    "COUNT_ALL",
  ]),

  AGGREGATE: new Set([
    ...BASE_FUNCS,
    ...Object.keys(AggregateFunctions),
    ...Object.keys(NativeAggregateFunctions),
  ]),
};
