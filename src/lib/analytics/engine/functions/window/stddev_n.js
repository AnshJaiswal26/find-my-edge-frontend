export const STDDEV_N = {
  args: ["number", "number"],
  returnType: "number",
  signature: "STDDEV_N(expr, n)",
  description: "Rolling standard deviation",

  init(n) {
    if (n <= 1) return null;
    return { n, seen: 0, mean: 0, m2: 0 };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;
    const delta = value - state.mean;
    state.mean += delta / state.seen;
    state.m2 += delta * (value - state.mean);

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.seen > 1 ? Math.sqrt(state.m2 / state.seen) : null;
  },
};
