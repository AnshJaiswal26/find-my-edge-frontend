import { ABS } from "./abs";
import { ROUND } from "./round";
import { CLAMP } from "./clamp";

import { FunctionType } from "../funtionType";
import { ExecutionMode } from "../executionMode";

const mathFns = { ABS, ROUND, CLAMP };

export const MathFunctions = Object.fromEntries(
  Object.entries(mathFns).map(([name, fn]) => [
    name,
    { ...fn, type: FunctionType.PURE, executionMode: ExecutionMode.AST },
  ]),
);
