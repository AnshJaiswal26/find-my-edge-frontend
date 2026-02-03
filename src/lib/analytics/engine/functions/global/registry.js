import { FUNCTION_TYPE } from "../type";

import {
  SUM,
  AVG,
  MAX,
  MIN,
  COUNT,
  COUNT_IF,
  COUNT_ALL,
  SUM_POSITIVE,
  SUM_NEGATIVE,
  COUNT_NEGATIVE,
  COUNT_POSITIVE,
  STDDEV,
  VARIANCE,
} from "./reducers";

export const GLOBAL_FUNCTIONS = {
  // ---------- Core Aggregations ----------
  SUM: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "SUM(expr)",
    description: "Sum of all non-null values",
  },

  AVG: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: AVG,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "AVG(expr)",
    description: "Average (mean) of values",
  },

  MAX: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: MAX,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "MAX(expr)",
    description: "Largest value",
  },

  MIN: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: MIN,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "MIN(expr)",
    description: "Smallest value",
  },

  COUNT: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "COUNT(expr)",
    description: "Count of non-null values",
  },

  COUNT_ALL: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_ALL,
    arity: 0,
    signature: "COUNT_ALL()",
    description: "Total number of records",
  },

  // ---------- Conditional / Boolean ----------
  COUNT_IF: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_IF,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "COUNT_IF(condition)",
    description: "Count of rows where condition is true",
  },

  COUNT_POSITIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_POSITIVE,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "COUNT_POSITIVE(expr)",
    description: "Count of values greater than 0",
  },

  COUNT_NEGATIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_NEGATIVE,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "COUNT_NEGATIVE(expr)",
    description: "Count of values less than 0",
  },

  // ---------- Signed Aggregations ----------
  SUM_POSITIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM_POSITIVE,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "SUM_POSITIVE(expr)",
    description: "Sum of values greater than 0",
  },

  SUM_NEGATIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM_NEGATIVE,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "SUM_NEGATIVE(expr)",
    description: "Sum of values less than 0",
  },

  // ---------- Distribution Metrics ----------
  STDDEV: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: STDDEV,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "STDDEV(expr)",
    description: "Standard deviation of values",
  },

  VARIANCE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: VARIANCE,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    signature: "VARIANCE(expr)",
    description: "Variance of values",
  },
};
