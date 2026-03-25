import { SEMANTIC_TYPE } from "@lib/analytics/schema";

export const AVG_N = {
  args: ["$T", SEMANTIC_TYPE.NUMBER],
  generics: {
    $T: [SEMANTIC_TYPE.NUMBER, SEMANTIC_TYPE.DURATION],
  },
  returnType: "$T",
  signature: "AVG_N(expr, n)",
  description: "Rolling average over N rows",

  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, sum: 0, count: 0 };
  },

  step(state, value) {
    if (value == null) return;
    state.sum += value;
    state.count++;
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.count ? state.sum / state.count : null;
  },
};
