export const SUM_N = {
  arity: 2,
  argTypes: ["number", "number"],
  returnType: "number",
  semantic: { args: [["number", "duration"], "number"], return: "same" },
  signature: "SUM_N(expr, n)",
  description: "Rolling sum over N rows",

  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, sum: 0 };
  },

  step(state, value) {
    if (value == null) return;
    state.sum += value;
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.sum;
  },
};
