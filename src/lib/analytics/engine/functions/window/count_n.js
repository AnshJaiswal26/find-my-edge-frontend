import { SEMANTIC_TYPE_VALUES } from "@lib/analytics/schema";

export const COUNT_N = {
  args: [SEMANTIC_TYPE_VALUES, "number"],
  returnType: "number",
  signature: "COUNT_N(expr, n)",
  description: "Rolling count over N rows",

  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, count: 0 };
  },

  step(state, value) {
    if (value != null) {
      state.count++;
    }
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.count;
  },
};
