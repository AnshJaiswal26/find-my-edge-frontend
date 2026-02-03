import { FUNCTION_TYPE } from "../type";
import { ADD, AVG, MAX, MIN, ABS, ROUND, CLAMP } from "./reducers";

export const BASE_FUNCTIONS = {
  ABS: {
    type: FUNCTION_TYPE.BASE,
    reducer: ABS,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    signature: "ABS(expr)",
    description: "Absolute value",
  },

  ROUND: {
    type: FUNCTION_TYPE.BASE,
    reducer: ROUND,
    arity: 2,
    argTypes: ["number", "number"], // value, digits
    returnType: "number",
    signature: "ROUND(expr, digits)",
    description: "Round to N decimal places",
  },

  CLAMP: {
    type: FUNCTION_TYPE.BASE,
    reducer: CLAMP,
    arity: 3,
    argTypes: ["number", "number", "number"], // value, min, max
    returnType: "number",
    signature: "CLAMP(expr, min, max)",
    description: "Clamp value to range",
  },

  ADD: {
    type: FUNCTION_TYPE.BASE,
    reducer: ADD,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "ADD(a, b)",
    description: "Row sum",
  },

  AVG: {
    type: FUNCTION_TYPE.BASE,
    reducer: AVG,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "AVG(a, b)",
    description: "Row average",
  },

  MAX: {
    type: FUNCTION_TYPE.BASE,
    reducer: MAX,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "MAX(a, b)",
    description: "Maximum value",
  },

  MIN: {
    type: FUNCTION_TYPE.BASE,
    reducer: MIN,
    arity: 2,
    argTypes: ["number", "number"],
    returnType: "number",
    signature: "MIN(a, b)",
    description: "Minimum value",
  },
};
