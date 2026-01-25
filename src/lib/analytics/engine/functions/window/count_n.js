export const COUNT_N = {
  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, count: 0 };
  },

  step(state, value) {
    if (value == null) return;
    state.count++;
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.count;
  },
};
