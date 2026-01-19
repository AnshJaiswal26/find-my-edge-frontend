export const MIN_N = {
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
