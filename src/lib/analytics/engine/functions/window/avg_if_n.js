export const AVG_IF_N = {
  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      sum: 0,
      count: 0,
    };
  },

  step(state, value, condition) {
    if (value == null || condition == null) return;

    state.seen++;

    if (condition) {
      state.sum += value;
      state.count++;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    if (state.count === 0) return 0;
    return state.sum / state.count;
  },
};
