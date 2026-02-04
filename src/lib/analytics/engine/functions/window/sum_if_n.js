export const SUM_IF_N = {
  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      sum: 0,
    };
  },

  step(state, value, condition) {
    if (value == null || condition == null) return;

    state.seen++;

    if (condition) {
      state.sum += value;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.sum;
  },
};
