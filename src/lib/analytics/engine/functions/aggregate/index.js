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

import { AVG } from "./avg";
import { AVG_IF } from "./avg_if";
import { RATE } from "./rate";
import { RATIO } from "./ratio";
import { FACTOR } from "./factor";
import { EDGE_RATIO } from "./edge_ratio";
import { PERCENT_OF } from "./percent_of";

import { FunctionType } from "../funtionType";
import { ExecutionMode } from "../executionMode";

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

const ratioFns = {
  AVG,
  AVG_IF,
  RATE,
  RATIO,
  FACTOR,
  EDGE_RATIO,
  PERCENT_OF,
};

export const AggregateFunctions = {
  ...Object.fromEntries(
    Object.entries(globalFns).map(([name, fn]) => [
      name,
      { ...fn, type: FunctionType.AGGREGATE, executionMode: ExecutionMode.AST },
    ]),
  ),

  ...Object.fromEntries(
    Object.entries(ratioFns).map(([name, fn]) => [
      name,
      { ...fn, type: FunctionType.AGGREGATE, executionMode: ExecutionMode.AST },
    ]),
  ),
};
