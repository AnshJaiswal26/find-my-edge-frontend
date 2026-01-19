export const MAX_WIN_STREAK_N = {
  init(n) {
    if (n <= 0) return null;

    return {
      n,
      seen: 0, // non-null values processed
      current: 0, // current win streak
      max: 0, // max win streak
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (value > 0) {
      state.current++;
      if (state.current > state.max) {
        state.max = state.current;
      }
    } else {
      // loss or zero breaks win streak
      state.current = 0;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.max;
  },
};
