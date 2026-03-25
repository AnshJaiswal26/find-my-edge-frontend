import { AVG_N } from "./avg_n";

export const RATE_N = {
  args: ["boolean", "number"],
  returnType: "number",
  signature: "RATE_N(condition, n)",
  description: "Rate (percentage) of rows in last N where condition is true",

  int: AVG_N.init,
  step: AVG_N.step,
  result: AVG_N.result,
};
