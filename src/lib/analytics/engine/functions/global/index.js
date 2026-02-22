import { FUNCTION_TYPE } from "../type";

import { SUM } from "./sum";
import { MAX } from "./max";
import { MIN } from "./min";
import { COUNT } from "./count";
import { COUNT_IF } from "./count_if";
import { COUNT_ALL } from "./count_all";
import { COUNT_NEGATIVE } from "./count_negative";
import { COUNT_POSITIVE } from "./count_positive";
import { SUM_POSITIVE } from "./sum_positive";
import { SUM_NEGATIVE } from "./sum_negative";
import { SUM_IF } from "./sum_if";

import { STDDEV } from "./stddev";
import { VARIANCE } from "./variance";
import { VOLATILITY } from "./volatility";

import { STREAK } from "./streak";

import { MAX_DRAWDOWN } from "./max_drawdown";

const globalFns = {
  SUM,
  MAX,
  MIN,
  COUNT,
  COUNT_IF,
  COUNT_ALL,
  COUNT_NEGATIVE,
  COUNT_POSITIVE,
  SUM_POSITIVE,
  SUM_NEGATIVE,
  SUM_IF,
  STDDEV,
  VARIANCE,
  VOLATILITY,
  STREAK,
  MAX_DRAWDOWN,
};

export const GLOBAL_FUNCTIONS = Object.fromEntries(
  Object.entries(globalFns).map(([key, fn]) => [
    key,
    { ...fn, type: FUNCTION_TYPE.GLOBAL },
  ]),
);
