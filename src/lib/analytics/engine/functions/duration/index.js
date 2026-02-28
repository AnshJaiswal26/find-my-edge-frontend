import { DAYS } from "./days";
import { HOURS } from "./hours";
import { MINUTES } from "./minutes";
import { SECONDS } from "./seconds";

import { ExecutionMode } from "../executionMode";
import { FunctionType } from "../funtionType";

const durationFns = { SECONDS, DAYS, HOURS, MINUTES };

export const DurationFunctions = Object.fromEntries(
  Object.entries(durationFns).map(([name, fn]) => [
    name,
    { ...fn, type: FunctionType.PURE, executionMode: ExecutionMode.AST },
  ]),
);
