export const MAX_LOSE_STREAK_N = {
  init(n) {
    if (n <= 0) return null;

    return {
      n,
      seen: 0, // number of non-null values processed
      current: 0, // current losing streak
      max: 0, // max losing streak found
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (value < 0) {
      state.current++;
      if (state.current > state.max) {
        state.max = state.current;
      }
    } else {
      // streak breaks on win or zero
      state.current = 0;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.max;
  },
};
