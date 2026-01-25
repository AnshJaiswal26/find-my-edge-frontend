export const MAX_N = {
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
