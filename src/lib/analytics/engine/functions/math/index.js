import { ABS } from "./abs";
import { ROUND } from "./round";
import { CLAMP } from "./clamp";

import { FUNCTION_TYPE } from "../funtionType";
import { EXECUTION_MODE } from "../EXECUTION_MODE";

const mathFns = { ABS, ROUND, CLAMP };

export const MATH_FUNCTIONS = Object.fromEntries(
  Object.entries(mathFns).map(([name, fn]) => [
    name,
    { ...fn, type: FUNCTION_TYPE.PURE, executionMode: EXECUTION_MODE.AST },
  ]),
);
