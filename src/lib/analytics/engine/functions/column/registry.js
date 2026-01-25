import { FUNCTION_TYPE } from "../type";
import { fnPREV, fnSELF, fnRESET, fnCUM } from "./index";

export const COLUMN_FUNCTIONS = {
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
};
