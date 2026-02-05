import { FUNCTION_TYPE } from "../type";

import {
  AVG,
  AVG_IF,
  WIN_RATE,
  LOSS_RATE,
  RATE,
  RATIO,
  PAYOFF_RATIO,
  PROFIT_FACTOR,
  LOSS_FACTOR,
  EXPECTANCY,
  FACTOR,
  EDGE_RATIO,
  PERCENT_OF,
  // RECOVERY_FACTOR,
  // RISK_REWARD_RATIO,
  // KELLY_PERCENT,
  // PROFIT_TO_DRAWDOWN,
  // WIN_LOSS_RATIO,
  // AVERAGE_WIN_LOSS_RATIO,
} from "./reducers";

export const RATIO_FUNCTIONS = {
  AVG: {
    type: FUNCTION_TYPE.RATIO,
    reducer: AVG,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    signature: "AVG(expr)",
    description: "Average (mean) of values",
  },

  AVG_IF: {
    type: FUNCTION_TYPE.RATIO,
    reducer: AVG_IF,
    arity: 2,
    argTypes: ["number", "boolean"],
    returnType: "number",
    signature: "AVG_IF(expr, condition)",
    description: "Average of expr where condition is true",
  },

  WIN_RATE: {
    type: FUNCTION_TYPE.NATIVE_AGG,
    reducer: WIN_RATE,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: "ratio",
    signature: "WIN_RATE()",
    description: "Winning trades divided by total trades",
  },

  LOSS_RATE: {
    type: FUNCTION_TYPE.NATIVE_AGG,
    reducer: LOSS_RATE,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: "ratio",
    signature: "LOSS_RATE()",
    description: "Losing trades divided by total trades",
  },

  RATE: {
    type: FUNCTION_TYPE.RATIO,
    reducer: RATE, // reuse logic: avg(boolean) = rate
    arity: 1,
    argTypes: ["boolean"],
    returnType: "number",
    signature: "RATE(condition)",
    description: "Percentage of rows where condition is true",
  },

  // WIN_LOSS_RATIO: {
  //   type: FUNCTION_TYPE.RATIO,
  //   reducer: WIN_LOSS_RATIO,
  //   arity: 0,
  //   argTypes: [],
  //   returnType: "number",
  //   semantic: "ratio",
  //   signature: "WIN_LOSS_RATIO()",
  //   description: "Number of winning trades divided by losing trades",
  // },

  // --- Profitability Ratios ---
  PROFIT_FACTOR: {
    type: FUNCTION_TYPE.NATIVE_AGG,
    reducer: PROFIT_FACTOR,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: "ratio",
    signature: "PROFIT_FACTOR()",
    description: "Gross profit divided by gross loss",
  },

  LOSS_FACTOR: {
    type: FUNCTION_TYPE.NATIVE_AGG,
    reducer: LOSS_FACTOR,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: "ratio",
    signature: "LOSS_FACTOR()",
    description: "Gross loss divided by gross profit",
  },

  PAYOFF_RATIO: {
    type: FUNCTION_TYPE.NATIVE_AGG,
    reducer: PAYOFF_RATIO,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: "ratio",
    signature: "PAYOFF_RATIO()",
    description: "Average win divided by average loss",
  },

  // AVG_WIN_LOSS_RATIO: {
  //   type: FUNCTION_TYPE.RATIO,
  //   reducer: AVG_WIN_LOSS_RATIO,
  //   arity: 0,
  //   argTypes: [],
  //   returnType: "number",
  //   semantic: "ratio",
  //   signature: "AVG_WIN_LOSS_RATIO()",
  //   description: "Average winning trade divided by average losing trade",
  // },

  // --- Risk & Recovery Ratios ---
  // RECOVERY_FACTOR: {
  //   type: FUNCTION_TYPE.RATIO,
  //   reducer: RECOVERY_FACTOR,
  //   arity: 0,
  //   argTypes: [],
  //   returnType: "number",
  //   semantic: "ratio",
  //   signature: "RECOVERY_FACTOR()",
  //   description: "Net profit divided by maximum drawdown",
  // },

  // PROFIT_TO_DRAWDOWN: {
  //   type: FUNCTION_TYPE.RATIO,
  //   reducer: PROFIT_TO_DRAWDOWN,
  //   arity: 0,
  //   argTypes: [],
  //   returnType: "number",
  //   semantic: "ratio",
  //   signature: "PROFIT_TO_DRAWDOWN()",
  //   description: "Total profit divided by max drawdown",
  // },

  // RISK_REWARD_RATIO: {
  //   type: FUNCTION_TYPE.RATIO,
  //   reducer: RISK_REWARD_RATIO,
  //   arity: 0,
  //   argTypes: [],
  //   returnType: "number",
  //   semantic: "ratio",
  //   signature: "RISK_REWARD_RATIO()",
  //   description: "Average reward divided by average risk",
  // },

  // --- Strategy Optimization Ratios ---
  EXPECTANCY: {
    type: FUNCTION_TYPE.NATIVE_AGG,
    reducer: EXPECTANCY,
    arity: 0,
    argTypes: [],
    returnType: "number",
    semantic: "ratio",
    signature: "EXPECTANCY()",
    description:
      "Expected profit per trade (win rate × avg win − loss rate × avg loss)",
  },

  // KELLY_PERCENT: {
  //   type: FUNCTION_TYPE.RATIO,
  //   reducer: KELLY_PERCENT,
  //   arity: 0,
  //   argTypes: [],
  //   returnType: "number",
  //   semantic: "ratio",
  //   signature: "KELLY_PERCENT()",
  //   description: "Optimal capital allocation percentage using Kelly Criterion",
  // },

  RATE: {
    type: FUNCTION_TYPE.RATIO,
    reducer: RATE,
    arity: 1,
    argTypes: ["boolean"],
    returnType: "number",
    semantic: "ratio",
    signature: "RATE(condition)",
    description: "Proportion of rows where condition is true (0–1)",
  },

  RATIO: {
    type: FUNCTION_TYPE.RATIO,
    reducer: RATIO,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    semantic: "ratio",
    signature: "RATIO(a, b)",
    description: "Division of two aggregated values (a / b)",
  },

  FACTOR: {
    type: FUNCTION_TYPE.RATIO,
    reducer: FACTOR,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    semantic: "ratio",
    signature: "FACTOR(a, b)",
    description: "Magnitude comparison between two values (a / b)",
  },

  PERCENT_OF: {
    type: FUNCTION_TYPE.RATIO,
    reducer: PERCENT_OF,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    semantic: "ratio",
    signature: "PERCENT_OF(part, total)",
    description: "What percent one value is of another",
  },

  EDGE_RATIO: {
    type: FUNCTION_TYPE.RATIO,
    reducer: EDGE_RATIO,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "EDGE_RATIO(win, loss)",
    description: "Net edge ratio between two opposing values",
  },
};
