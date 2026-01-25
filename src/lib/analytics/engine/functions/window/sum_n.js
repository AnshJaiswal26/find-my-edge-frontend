export const SUM_N = {
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
