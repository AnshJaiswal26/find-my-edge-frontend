import { FUNCTION_TYPE } from "../type";
import { fnIF } from "./if";

export const CONDITION_FUNCTIONS = {
  IF: {
    type: FUNCTION_TYPE.CONDITION,
    exec: fnIF,
    arity: 3,
    signature: "IF(cond, yes, no)",
    argTypes: ["boolean", "number", "number"],
    returnType: "number",
    semantic: {
      args: ["boolean", "number", "number"],
      return: "number",
    },
    description: "Conditional expression",
  },
};
