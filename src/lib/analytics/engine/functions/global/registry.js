import { FUNCTION_TYPE } from "../type";

import {
  SUM,
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
  STREAK,
  SUM_IF,
  MAX_DRAWDOWN,
  VOLATILITY,
} from "./reducers";

export const GLOBAL_FUNCTIONS = {
  // ---------- Core Aggregations ----------
  SUM: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: [["number", "duration"]],
      return: "same",
    },
    signature: "SUM(expr)",
    description: "Sum of all non-null values",
  },

  MAX: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: MAX,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: [["number", "duration"]],
      return: "same",
    },
    signature: "MAX(expr)",
    description: "Largest value",
  },

  MIN: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: MIN,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: [["number", "duration"]],
      return: "same",
    },
    signature: "MIN(expr)",
    description: "Smallest value",
  },

  COUNT: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT,
    arity: 1,
    argTypes: ["any"],
    returnType: "number",
    semantic: { args: ["any"], return: "number" },
    signature: "COUNT(expr)",
    description: "Count of non-null values",
  },

  COUNT_ALL: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_ALL,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: { args: [], return: "number" },
    signature: "COUNT_ALL()",
    description: "Total number of records",
  },

  // ---------- Conditional / Boolean ----------
  COUNT_IF: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_IF,
    arity: 1,
    argTypes: ["boolean"],
    returnType: "number",
    semantic: { args: ["boolean"], return: "number" },
    signature: "COUNT_IF(condition)",
    description: "Count of rows where condition is true",
  },

  STREAK: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: STREAK,
    arity: 1,
    argTypes: ["boolean"],
    returnType: "number",
    semantic: { args: ["boolean"], return: "number" },
    signature: "STREAK(condition)",
    description: "Longest consecutive TRUE streak over all rows",
  },

  SUM_POSITIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM_POSITIVE,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: [["number", "duration"]],
      return: "same",
    },
    signature: "SUM_POSITIVE(expr)",
    description: "Sum of values greater than 0",
  },

  SUM_NEGATIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM_NEGATIVE,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: [["number", "duration"]],
      return: "same",
    },
    signature: "SUM_NEGATIVE(expr)",
    description: "Sum of values less than 0",
  },

  COUNT_POSITIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_POSITIVE,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: { args: ["number"], return: "number" },
    signature: "COUNT_POSITIVE(expr)",
    description: "Count of values greater than 0",
  },

  COUNT_NEGATIVE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: COUNT_NEGATIVE,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: { args: ["number"], return: "number" },
    signature: "COUNT_NEGATIVE(expr)",
    description: "Count of values less than 0",
  },

  // ---------- Distribution Metrics ----------
  STDDEV: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: STDDEV,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: { args: ["number"], return: "number" },
    signature: "STDDEV(expr)",
    description: "Standard deviation of values",
  },

  VARIANCE: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: VARIANCE,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: { args: ["number"], return: "number" },
    signature: "VARIANCE(expr)",
    description: "Variance of values",
  },

  VOLATILITY: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: VOLATILITY,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: { args: ["number"], return: "number" },
    signature: "VOLATILITY(expr)",
    description: "Standard deviation of returns over entire sequence",
  },

  SUM_IF: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: SUM_IF,
    arity: 2,
    argTypes: ["number", "boolean"],
    returnType: "number",
    semantic: {
      args: [["number", "duration"], "boolean"],
      return: "same",
    },
    signature: "SUM_IF(expr, condition)",
    description: "Sum of expr where condition is true",
  },

  MAX_DRAWDOWN: {
    type: FUNCTION_TYPE.GLOBAL,
    reducer: MAX_DRAWDOWN,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: { args: ["number"], return: "number" },
    signature: "MAX_DRAWDOWN(expr)",
    description: "Maximum drawdown over entire sequence",
  },
};
