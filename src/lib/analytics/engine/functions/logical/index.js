import { IF } from "./if";
import { FUNCTION_TYPE } from "../funtionType";
import { EXECUTION_MODE } from "../EXECUTION_MODE";

const logicalFns = { IF };

export const LOGICAL_FUNCTIONS = Object.fromEntries(
  Object.entries(logicalFns).map(([name, fn]) => [
    name,
    { ...fn, type: FUNCTION_TYPE.PURE, executionMode: EXECUTION_MODE.AST },
  ]),
);
