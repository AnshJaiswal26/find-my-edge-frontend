export const AVG_LOSS_N = {
  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, sum: 0, count: 0 };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (value < 0) {
      state.sum += Math.abs(value);
      state.count++;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.count ? state.sum / state.count : null;
  },
};
