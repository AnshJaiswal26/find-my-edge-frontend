import { FUNCTION_TYPE } from "../type";
import {
  SUM_N,
  AVG_N,
  MAX_N,
  MIN_N,
  COUNT_N,
  STREAK_N,
  AVG_IF_N,
  SUM_IF_N,
  SHARPE_N,
  STDDEV_N,
  EXPECTANCY_N,
  MAX_DRAWDOWN_N,
  VOLATILITY_N,
} from "./reducers";

export const WINDOW_FUNCTIONS = {
  SUM_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: SUM_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "SUM_N(expr, n)",
    description: "Rolling sum over N rows",
  },

  AVG_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: AVG_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "AVG_N(expr, n)",
    description: "Rolling average over N rows",
  },

  COUNT_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: COUNT_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "COUNT_N(expr, n)",
    description: "Rolling count over N rows",
  },

  MAX_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MAX_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "MAX_N(expr, n)",
    description: "Rolling max over N rows",
  },

  MIN_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MIN_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "MIN_N(expr, n)",
    description: "Rolling min over N rows",
  },

  STREAK_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: STREAK_N,
    arity: 2,
    argTypes: ["boolean", "number"],
    returnType: "number",
    signature: "STREAK_N(condition, n)",
    description: "Longest consecutive TRUE streak within last N rows",
  },

  SUM_IF_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: SUM_IF_N,
    arity: 3,
    argTypes: ["number", "boolean", "number"],
    returnType: "number",
    signature: "SUM_IF_N(expr, condition, n)",
    description: "Rolling sum of expr over last N rows where condition is true",
  },

  AVG_IF_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: AVG_IF_N,
    arity: 3,
    argTypes: ["number", "boolean", "number"],
    returnType: "number",
    signature: "AVG_IF_N(expr, condition, n)",
    description:
      "Rolling average of expr over last N rows where condition is true",
  },

  COUNT_IF_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: SUM_N, // reuse SUM_N reducer
    arity: 2,
    argTypes: ["boolean", "number"],
    returnType: "number",
    signature: "COUNT_IF_N(condition, n)",
    description: "Count of rows in last N where condition is true",
  },

  RATE_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: AVG_N, // reuse AVG_N reducer
    arity: 2,
    argTypes: ["boolean", "number"],
    returnType: "number",
    signature: "RATE_N(condition, n)",
    description: "Rate (percentage) of rows in last N where condition is true",
  },

  STDDEV_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: STDDEV_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "STDDEV_N(expr, n)",
    description: "Rolling standard deviation",
  },

  MAX_DRAWDOWN_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MAX_DRAWDOWN_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "MAX_DRAWDOWN_N(expr, n)",
    description: "Maximum drawdown over last N rows",
  },

  VOLATILITY_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: VOLATILITY_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "VOLATILITY_N(expr, n)",
    description: "Standard deviation of returns over last N rows",
  },

  SHARPE_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: SHARPE_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "SHARPE_N(expr, n)",
    description: "Sharpe ratio over last N rows (risk-free = 0)",
  },

  EXPECTANCY_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: EXPECTANCY_N,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "EXPECTANCY_N(expr, n)",
    description: "Trade expectancy (win rate × avg win − loss rate × avg loss)",
  },
};
