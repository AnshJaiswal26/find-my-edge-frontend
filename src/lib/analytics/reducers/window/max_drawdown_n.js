export const MAX_DRAWDOWN_N = {
  init(n) {
    if (n <= 0) return null;

    return {
      n,
      seen: 0,
      peak: -Infinity,
      maxDrawdown: 0,
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    // update peak
    if (value > state.peak) {
      state.peak = value;
    }

    // compute drawdown
    const drawdown = value - state.peak;

    // track worst drawdown (most negative)
    if (drawdown < state.maxDrawdown) {
      state.maxDrawdown = drawdown;
    }

    // stop once window is full
    if (state.seen >= state.n) {
      return false;
    }
  },

  result(state) {
    return state.maxDrawdown;
  },
};
