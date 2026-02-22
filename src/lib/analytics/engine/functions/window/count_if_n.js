import { SUM_N } from "./sum_n";

export const COUNT_IF_N = {
  arity: 2,
  argTypes: ["boolean", "number"],
  returnType: "number",
  signature: "COUNT_IF_N(condition, n)",
  description: "Count of rows in last N where condition is true",

  init: SUM_N.init,
  step: SUM_N.step,
  result: SUM_N.result,
};
