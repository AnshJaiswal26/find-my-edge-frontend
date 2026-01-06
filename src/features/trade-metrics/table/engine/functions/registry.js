import { fnCUM, fnPREV, fnSELF, fnRESET } from "./cumulative";
import { fnSUM, fnAVG } from "./aggregation";
import { fnIF } from "./logical";

export const FUNCTION_REGISTRY = {
  PREV: {
    exec: fnPREV,
    arity: 1,
    icon: "↩",
    signature: "PREV(expr)",
    description: "Value from previous row",
  },

  SELF: {
    exec: fnSELF,
    arity: 0,
    icon: "•",
    signature: "SELF()",
    description: "Previous computed value",
  },

  CUM: {
    exec: fnCUM,
    arity: 1,
    icon: "∑",
    signature: "CUM(expr)",
    description: "Cumulative sum",
  },

  RESET: {
    exec: fnRESET,
    arity: 2,
    icon: "⟳",
    signature: "RESET(expr, cond)",
    description: "Reset cumulative on condition",
  },

  SUM: {
    exec: fnSUM,
    arity: 1,
    icon: "Σ",
    signature: "SUM(expr)",
    description: "Aggregate sum",
  },

  AVG: {
    exec: fnAVG,
    arity: 2,
    icon: "μ",
    signature: "AVG(expr, n)",
    description: "Moving average",
  },

  IF: {
    exec: fnIF,
    arity: 3,
    icon: "ƒ",
    signature: "IF(cond, yes, no)",
    description: "Conditional expression",
  },
};
