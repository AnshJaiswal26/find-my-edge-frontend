import { WIN_RATE } from "./win_rate";
import { LOSS_RATE } from "./loss_rate";
import { PROFIT_FACTOR } from "./profit_factor";
import { LOSS_FACTOR } from "./loss_factor";
import { PAYOFF_RATIO } from "./payoff_ratio";
import { EXPECTANCY } from "./expectancy";

import { FUNCTION_TYPE } from "@lib/analytics/engine/functions/funtionType";
import { EXECUTION_MODE } from "@lib/analytics/engine/functions/EXECUTION_MODE";

const nativeFns = {
  WIN_RATE,
  LOSS_RATE,
  PROFIT_FACTOR,
  LOSS_FACTOR,
  PAYOFF_RATIO,
  EXPECTANCY,
};

export const NATIVE_AGGREGATE_FUNCTIONS = Object.fromEntries(
  Object.entries(nativeFns).map(([key, fn]) => [
    key,
    {
      ...fn,
      type: FUNCTION_TYPE.AGGREGATE,
      ExecutionMode: EXECUTION_MODE.NATIVE,
    },
  ]),
);
