export const MIN_N = {
  argTypes: ["number", "number"],
  returnType: "number",
  semantic: { args: [["number", "duration"], "number"], return: "same" },
  signature: "MIN_N(expr, n)",
  description: "Rolling min over N rows",

  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      min: null,
    };
  },

  step(state, value) {
    if (value == null) return;

    state.min = state.min === null ? value : Math.min(state.min, value);

    if (++state.seen >= state.n) {
      return false; // stop window scan
    }
  },

  result(state) {
    return state.min;
  },
};
