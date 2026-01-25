import { FUNCTION_TYPE } from "../type";
import { SUM, AVG, MAX, MIN, ABS, ROUND, CLAMP } from "./reducers";

export const BASE_FUNCTIONS = {
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
};
