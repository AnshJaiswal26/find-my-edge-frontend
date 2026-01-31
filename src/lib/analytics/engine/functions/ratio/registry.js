import { FUNCTION_TYPE } from "../type";

import {
  EXPECTANCY,
  LOSS_FACTOR,
  LOSS_RATE,
  PAYOFF_RATIO,
  PROFIT_FACTOR,
  WIN_RATE,
} from "./reducers";

export const RATIO_FUNCTIONS = {
  WIN_RATE: {
    type: FUNCTION_TYPE.RATIO,
    reducer: WIN_RATE,
    description: "Winning trades divided by total trades",
  },

  LOSS_RATE: {
    type: FUNCTION_TYPE.RATIO,
    reducer: LOSS_RATE,
    description: "Losing trades divided by total trades",
  },

  PROFIT_FACTOR: {
    type: FUNCTION_TYPE.RATIO,
    reducer: PROFIT_FACTOR,
    description: "Gross profit divided by gross loss",
  },

  LOSS_FACTOR: {
    type: FUNCTION_TYPE.RATIO,
    reducer: LOSS_FACTOR,
    description: "Gross loss divided by gross profit",
  },

  PAYOFF_RATIO: {
    type: FUNCTION_TYPE.RATIO,
    reducer: PAYOFF_RATIO,
    description: "Average win divided by average loss",
  },

  EXPECTANCY: {
    type: FUNCTION_TYPE.RATIO,
    reducer: EXPECTANCY,
    description: "Expected profit per trade",
  },
};
