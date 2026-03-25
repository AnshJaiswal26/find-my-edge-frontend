import { DAYS } from "./days";
import { HOURS } from "./hours";
import { MINUTES } from "./minutes";
import { SECONDS } from "./seconds";

import { EXECUTION_MODE } from "../EXECUTION_MODE";
import { FUNCTION_TYPE } from "../funtionType";

const durationFns = { SECONDS, DAYS, HOURS, MINUTES };

export const DURATION_FUNCTIONS = Object.fromEntries(
  Object.entries(durationFns).map(([name, fn]) => [
    name,
    { ...fn, type: FUNCTION_TYPE.PURE, executionMode: EXECUTION_MODE.AST },
  ]),
);
