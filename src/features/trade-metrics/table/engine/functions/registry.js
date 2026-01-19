import { fnCUM, fnPREV, fnSELF, fnRESET } from "./column";

export function fnIF(fn, ctx) {
  const [condExpr, trueExpr, falseExpr] = fn.args;

  const condition = ctx.evaluate(condExpr, ctx);

  return condition ? ctx.evaluate(trueExpr, ctx) : ctx.evaluate(falseExpr, ctx);
}

/* base reducers */
import {
  SUM,
  AVG,
  MIN,
  MAX,
  COALESCE,
  ABS,
  ROUND,
  CLAMP,
  MAX_LOSE_STREAK_N,
  MAX_WIN_STREAK_N,
  IF,
} from "@lib/analytics/reducers";

/* window reducers */
import {
  SUM_N,
  AVG_N,
  COUNT_N,
  MAX_N,
  MIN_N,
  AVG_WIN_N,
  AVG_LOSS_N,
  WIN_RATE_N,
  STDDEV_N,
} from "@lib/analytics/reducers";

export const FUNCTION_TYPE = {
  COLUMN: "column",
  BASE: "base",
  WINDOW: "window",
  CONDITION: "condition",
};

export const FUNCTION_REGISTRY = {
  /* ---------- COLUMN / STATE ---------- */
  PREV: {
    exec: fnPREV,
    type: FUNCTION_TYPE.COLUMN,
    arity: 1,
    signature: "PREV(expr)",
    description: "Value from previous row",
  },

  SELF: {
    exec: fnSELF,
    type: FUNCTION_TYPE.COLUMN,
    arity: 0,
    signature: "SELF()",
    description: "Previous computed value",
  },

  CUM: {
    exec: fnCUM,
    type: FUNCTION_TYPE.COLUMN,
    arity: 1,
    signature: "CUM(expr)",
    description: "Cumulative value",
  },

  RESET: {
    exec: fnRESET,
    type: FUNCTION_TYPE.COLUMN,
    arity: 2,
    signature: "RESET(expr, cond)",
    description: "Reset cumulative when condition is true",
  },

  /* ---------- BASE / ROW ---------- */
  IF: {
    type: FUNCTION_TYPE.CONDITION,
    exec: fnIF,
    arity: 3,
    signature: "IF(cond, yes, no)",
    description: "Conditional expression",
  },

  ABS: {
    type: FUNCTION_TYPE.BASE,
    reducer: ABS,
    arity: 1,
    signature: "ABS(expr)",
    description: "Absolute value",
  },

  ROUND: {
    type: FUNCTION_TYPE.BASE,
    reducer: ROUND,
    arity: 2,
    signature: "ROUND(expr, digits)",
    description: "Round to N decimal places",
  },

  CLAMP: {
    type: FUNCTION_TYPE.BASE,
    reducer: CLAMP,
    arity: 3,
    signature: "CLAMP(expr, min, max)",
    description: "Clamp value to range",
  },

  COALESCE: {
    type: FUNCTION_TYPE.BASE,
    reducer: COALESCE,
    arity: -1,
    signature: "COALESCE(a, b, ...)",
    description: "First non-null value",
  },

  SUM: {
    type: FUNCTION_TYPE.BASE,
    reducer: SUM,
    arity: 2,
    signature: "SUM(a, b, ...)",
    description: "Row sum",
  },

  AVG: {
    type: FUNCTION_TYPE.BASE,
    reducer: AVG,
    arity: 2,
    signature: "AVG(a, b, ...)",
    description: "Row average",
  },

  MAX: {
    type: FUNCTION_TYPE.BASE,
    reducer: MAX,
    arity: 1,
    signature: "MAX(a, b, ...)",
    description: "Maximum value",
  },

  MIN: {
    type: FUNCTION_TYPE.BASE,
    reducer: MIN,
    arity: 1,
    signature: "MIN(a, b, ...)",
    description: "Minimum value",
  },

  /* ---------- WINDOW / ROLLING ---------- */
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
};
