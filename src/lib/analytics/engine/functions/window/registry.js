import { FUNCTION_TYPE } from "../type";
import {
  AVG_LOSS_N,
  AVG_N,
  AVG_WIN_N,
  COUNT_N,
  EXPECTANCY_N,
  MAX_DRAWDOWN_N,
  MAX_LOSE_STREAK_N,
  MAX_N,
  MAX_WIN_STREAK_N,
  MIN_N,
  SHARPE_N,
  STDDEV_N,
  SUM_N,
  VOLATILITY_N,
  WIN_RATE_N,
} from "./reducers";

export const WINDOW_FUNCTIONS = {
  SUM_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: SUM_N,
    arity: 2,
    signature: "SUM_N(expr, n)",
    description: "Rolling sum over N rows",
  },

  AVG_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: AVG_N,
    arity: 2,
    signature: "AVG_N(expr, n)",
    description: "Rolling average over N rows",
  },

  COUNT_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: COUNT_N,
    arity: 2,
    signature: "COUNT_N(expr, n)",
    description: "Rolling count over N rows",
  },

  MAX_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MAX_N,
    arity: 2,
    signature: "MAX_N(expr, n)",
    description: "Rolling max over N rows",
  },

  MIN_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MIN_N,
    arity: 2,
    signature: "MIN_N(expr, n)",
    description: "Rolling min over N rows",
  },

  AVG_WIN_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: AVG_WIN_N,
    arity: 2,
    signature: "AVG_WIN_N(expr, n)",
    description: "Rolling average of winning values",
  },

  AVG_LOSS_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: AVG_LOSS_N,
    arity: 2,
    signature: "AVG_LOSS_N(expr, n)",
    description: "Rolling average of losing values",
  },

  WIN_RATE_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: WIN_RATE_N,
    arity: 2,
    signature: "WIN_RATE_N(expr, n)",
    description: "Rolling win rate",
  },

  STDDEV_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: STDDEV_N,
    arity: 2,
    signature: "STDDEV_N(expr, n)",
    description: "Rolling standard deviation",
  },

  MAX_LOSE_STREAK_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MAX_LOSE_STREAK_N,
    arity: 2,
    signature: "MAX_LOSE_STREAK_N(expr, n)",
    description: "Maximum consecutive losing streak over last N rows",
  },

  MAX_WIN_STREAK_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MAX_WIN_STREAK_N,
    arity: 2,
    signature: "MAX_WIN_STREAK_N(expr, n)",
    description: "Maximum consecutive winning streak over last N rows",
  },

  MAX_DRAWDOWN_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: MAX_DRAWDOWN_N,
    arity: 2,
    signature: "MAX_DRAWDOWN_N(expr, n)",
    description: "Maximum drawdown over last N rows",
  },

  VOLATILITY_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: VOLATILITY_N,
    arity: 2,
    signature: "VOLATILITY_N(expr, n)",
    description: "Standard deviation of returns over last N rows",
  },

  SHARPE_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: SHARPE_N,
    arity: 2,
    signature: "SHARPE_N(expr, n)",
    description: "Sharpe ratio over last N rows (risk-free = 0)",
  },

  EXPECTANCY_N: {
    type: FUNCTION_TYPE.WINDOW,
    reducer: EXPECTANCY_N,
    arity: 2,
    signature: "EXPECTANCY_N(expr, n)",
    description: "Trade expectancy (win rate × avg win − loss rate × avg loss)",
  },
};
