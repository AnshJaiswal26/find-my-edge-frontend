export const MAX_N = {
  args: ["$T", "number"],
  generics: {
    $T: ["number", "duration"],
  },
  returnType: "$T",
  signature: "MAX_N(expr, n)",
  description: "Rolling max over N rows",

  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, max: null };
  },

  step(state, value) {
    if (value == null) return;
    state.max = state.max === null ? value : Math.max(state.max, value);
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.max;
  },
};
