export const STREAK_N = {
  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      current: 0,
      max: 0,
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (value === 1) {
      state.current++;
      if (state.current > state.max) {
        state.max = state.current;
      }
    } else {
      state.current = 0;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.max;
  },
};
