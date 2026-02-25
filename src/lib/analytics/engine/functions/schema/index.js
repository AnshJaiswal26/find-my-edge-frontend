import { FUNCTION_TYPE } from "../type";
import { fnCUMSUM } from "./fnCUMSUM";
import { fnCUMSUM_RESET } from "./fnCUMSUM_RESET";
import { fnPREV } from "./fnPREV";
import { fnSELF } from "./fnSELF";

export const SCHEMA_FUNCTIONS = {
  PREV: {
    exec: fnPREV,
    type: FUNCTION_TYPE.SCHEMA,
    arity: 1,
    argTypes: ["any"], // expression allowed
    returnType: "any",
    signature: "PREV(expr)",
    description: "Value of expression from previous row",
  },

  SELF: {
    exec: fnSELF,
    type: FUNCTION_TYPE.SCHEMA,
    arity: 0,
    argTypes: [],
    returnType: "any",
    signature: "SELF()",
    description: "Previous computed value of this column",
  },

  CUMSUM: {
    exec: fnCUMSUM,
    type: FUNCTION_TYPE.SCHEMA,
    arity: 1,
    argTypes: ["number"], // numeric expression, not only key
    returnType: "number",
    signature: "CUMSUM(expr)",
    description: "Cumulative sum over rows",
  },

  CUMSUM_RESET: {
    exec: fnCUMSUM_RESET,
    type: FUNCTION_TYPE.SCHEMA,
    arity: 2,
    argTypes: ["number", "boolean"], // numeric expr + boolean expr
    returnType: "number",
    signature: "CUMSUM_RESET(expr, condition)",
    description: "Accumulate expr but reset when condition is true",
  },
};
