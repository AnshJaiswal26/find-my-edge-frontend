
import { FunctionType } from "@lib/analytics/engine/functions/funtionType";
import { ExecutionMode } from "@lib/analytics/engine/functions/executionMode";

const nativeFns = {
  WIN_RATE,
  LOSS_RATE,
  PROFIT_FACTOR,
  LOSS_FACTOR,
  PAYOFF_RATIO,
  EXPECTANCY,
};

export const NativeAggregateFunctions = Object.fromEntries(
  Object.entries(nativeFns).map(([key, fn]) => [
    key,
    {
      ...fn,
      type: FunctionType.AGGREGATE,
      ExecutionMode: ExecutionMode.NATIVE,
    },
  ]),
);
