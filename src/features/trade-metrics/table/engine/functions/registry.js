import { fnCUM, fnPREV, fnSELF, fnRESET } from "./column";
import {
  fnSUM_N,
  fnAVG_N,
  fnCOUNT_N,
  fnMAX_N,
  fnMIN_N,
  fnAVG_WIN_N,
  fnAVG_LOSS_N,
  fnWIN_RATE_N,
  fnSTDDEV_N,
} from "./rolling";
import {
  fnIF,
  fnABS,
  fnAVG,
  fnCLAMP,
  fnCOALESCE,
  fnMAX,
  fnMIN,
  fnROUND,
  fnSUM,
} from "./row";

export const FUNCTION_REGISTRY = {
  /* ---------- COLUMN / STATE ---------- */
  PREV: {
    exec: fnPREV,
    arity: 1,
    signature: "PREV(expr)",
    description: "Value from previous row",
  },

  SELF: {
    exec: fnSELF,
    arity: 0,
    signature: "SELF()",
    description: "Previous computed value",
  },

  CUM: {
    exec: fnCUM,
    arity: 1,
    signature: "CUM(expr)",
    description: "Cumulative value",
  },

  RESET: {
    exec: fnRESET,
    arity: 2,
    signature: "RESET(expr, cond)",
    description: "Reset cumulative when condition is true",
  },

  /* ---------- ROW FUNCTIONS ---------- */
  IF: {
    exec: fnIF,
    arity: 3,
    signature: "IF(cond, yes, no)",
    description: "Conditional expression",
  },

  ABS: {
    exec: fnABS,
    arity: 1,
    signature: "ABS(expr)",
    description: "Absolute value",
  },

  ROUND: {
    exec: fnROUND,
    arity: 2,
    signature: "ROUND(expr, digits)",
    description: "Round to N decimal places",
  },

  CLAMP: {
    exec: fnCLAMP,
    arity: 3,
    signature: "CLAMP(expr, min, max)",
    description: "Clamp value to range",
  },

  COALESCE: {
    exec: fnCOALESCE,
    arity: -1,
    signature: "COALESCE(a, b, ...)",
    description: "First non-null value",
  },

  SUM: {
    exec: fnSUM,
    arity: 1,
    signature: "SUM(expr)",
    description: "Row sum",
  },

  AVG: {
    exec: fnAVG,
    arity: 2,
    signature: "AVG(expr)",
    description: "Row avg",
  },

  MAX: {
    exec: fnMAX,
    arity: 1,
    signature: "MAX(expr)",
    description: "Maximum value",
  },

  MIN: {
    exec: fnMIN,
    arity: 1,
    signature: "MIN(expr)",
    description: "Minimum value",
  },

  /* ---------- ROLLING / WINDOW ---------- */
  SUM_N: {
    exec: fnSUM_N,
    arity: 2,
    signature: "SUM_N(expr, n)",
    description: "Rolling sum over N rows",
  },

  AVG_N: {
    exec: fnAVG_N,
    arity: 2,
    signature: "AVG_N(expr, n)",
    description: "Rolling average over N rows",
  },

  COUNT_N: {
    exec: fnCOUNT_N,
    arity: 2,
    signature: "COUNT_N(expr, n)",
    description: "Rolling count over N rows",
  },

  MAX_N: {
    exec: fnMAX_N,
    arity: 2,
    signature: "MAX_N(expr, n)",
    description: "Rolling max over N rows",
  },

  MIN_N: {
    exec: fnMIN_N,
    arity: 2,
    signature: "MIN_N(expr, n)",
    description: "Rolling min over N rows",
  },

  AVG_WIN_N: {
    exec: fnAVG_WIN_N,
    arity: 2,
    signature: "AVG_WIN_N(expr, n)",
    description: "Rolling average of winning values",
  },

  AVG_LOSS_N: {
    exec: fnAVG_LOSS_N,
    arity: 2,
    signature: "AVG_LOSS_N(expr, n)",
    description: "Rolling average of losing values",
  },

  WIN_RATE_N: {
    exec: fnWIN_RATE_N,
    arity: 2,
    signature: "WIN_RATE_N(expr, n)",
    description: "Rolling win rate",
  },

  STDDEV_N: {
    exec: fnSTDDEV_N,
    arity: 2,
    signature: "STDDEV_N(expr, n)",
    description: "Rolling standard deviation",
  },
};
