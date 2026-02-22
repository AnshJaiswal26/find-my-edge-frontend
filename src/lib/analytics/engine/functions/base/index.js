import { FUNCTION_TYPE } from "../type";
import { ABS } from "./abs";
import { ROUND } from "./round";
import { CLAMP } from "./clamp";

const baseFns = { ABS, ROUND, CLAMP };

export const BASE_FUNCTIONS = Object.fromEntries(
  Object.entries(baseFns).map(([key, fn]) => [
    key,
    { ...fn, type: FUNCTION_TYPE.BASE },
  ]),
);
