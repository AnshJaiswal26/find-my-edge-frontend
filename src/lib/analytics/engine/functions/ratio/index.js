import { FUNCTION_TYPE } from "../type";

import { AVG } from "./avg";
import { AVG_IF } from "./avg_if";
import { RATE } from "./rate";
import { RATIO } from "./ratio";
import { FACTOR } from "./factor";
import { EDGE_RATIO } from "./edge_ratio";
import { PERCENT_OF } from "./percent_of";

import { WIN_RATE } from "./win_rate";
import { LOSS_RATE } from "./loss_rate";
import { PROFIT_FACTOR } from "./profit_factor";
import { LOSS_FACTOR } from "./loss_fator";
import { PAYOFF_RATIO } from "./payoff_ratio";
import { EXPECTANCY } from "./expectancy";

// RECOVERY_FACTOR,
// RISK_REWARD_RATIO,
// KELLY_PERCENT,
// PROFIT_TO_DRAWDOWN,
// WIN_LOSS_RATIO,
// AVERAGE_WIN_LOSS_RATIO,

const ratioFns = {
  AVG,
  AVG_IF,
  RATE,
  RATIO,
  FACTOR,
  EDGE_RATIO,
  PERCENT_OF,
};

const ratioNativeFns = {
  WIN_RATE,
  LOSS_RATE,
  PROFIT_FACTOR,
  LOSS_FACTOR,
  PAYOFF_RATIO,
  EXPECTANCY,
};

export const RATIO_FUNCTIONS = {
  ...Object.fromEntries(
    Object.entries(ratioFns).map(([key, fn]) => [
      key,
      { ...fn, type: FUNCTION_TYPE.WINDOW },
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(ratioNativeFns).map(([key, fn]) => [
      key,
      { ...fn, type: FUNCTION_TYPE.NATIVE_AGG },
    ]),
  ),
};
