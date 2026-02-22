import { FUNCTION_TYPE } from "../type";

import { SUM_N } from "./sum_n";
import { AVG_N } from "./avg_n";
import { COUNT_N } from "./count_n";
import { COUNT_IF_N } from "./count_if_n";
import { RATE_N } from "./rate_n";
import { MAX_N } from "./max_n";
import { MIN_N } from "./min_n";
import { STDDEV_N } from "./stddev_n";
import { MAX_DRAWDOWN_N } from "./max_drawdown_n";
import { VOLATILITY_N } from "./volatility_n";
import { SHARPE_N } from "./sharpe_n";
import { EXPECTANCY_N } from "./expectancy_n";

const windowFns = {
  SUM_N,
  AVG_N,
  COUNT_N,
  MAX_N,
  MIN_N,
  COUNT_IF_N,
  RATE_N,
  STDDEV_N,
  MAX_DRAWDOWN_N,
  VOLATILITY_N,
  SHARPE_N,
  EXPECTANCY_N,
};

export const WINDOW_FUNCTIONS = Object.fromEntries(
  Object.entries(windowFns).map(([key, fn]) => [
    key,
    { ...fn, type: FUNCTION_TYPE.WINDOW },
  ]),
);
