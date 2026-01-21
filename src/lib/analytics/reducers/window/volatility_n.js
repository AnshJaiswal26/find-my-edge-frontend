export const VOLATILITY_N = {
  init(n) {
    if (n <= 1) return null;

    return {
      n,
      seen: 0,
      prev: null,

      // Welford's algorithm
      count: 0,
      mean: 0,
      m2: 0,
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (state.prev != null) {
      const ret = value - state.prev;

      // Welford update
      state.count++;
      const delta = ret - state.mean;
      state.mean += delta / state.count;
      state.m2 += delta * (ret - state.mean);
    }

    state.prev = value;

    // stop once window is full
    if (state.seen >= state.n) {
      return false;
    }
  },

  result(state) {
    if (state.count === 0) return 0;

    const variance = state.m2 / state.count;
    return Math.sqrt(variance);
  },
};
