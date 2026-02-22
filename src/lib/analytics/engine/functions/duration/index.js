import { FUNCTION_TYPE } from "../type";

import { DAYS } from "./days";
import { HOURS } from "./hours";
import { MINUTES } from "./minutes";
import { SECONDS } from "./seconds";

const durationFns = { SECONDS, DAYS, HOURS, MINUTES };

export const DURATION_FUNCTIONS = Object.fromEntries(
  Object.entries(durationFns).map(([key, fn]) => [
    key,
    { ...fn, type: FUNCTION_TYPE.GLOBAL },
  ]),
);
