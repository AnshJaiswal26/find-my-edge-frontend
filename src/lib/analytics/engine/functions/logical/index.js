import { IF } from "./if";
import { FunctionType } from "../funtionType";
import { ExecutionMode } from "../executionMode";

const logicalFns = { IF };

export const LogicalFunctions = Object.fromEntries(
  Object.entries(logicalFns).map(([name, fn]) => [
    name,
    { ...fn, type: FunctionType.PURE, executionMode: ExecutionMode.AST },
  ]),
);
