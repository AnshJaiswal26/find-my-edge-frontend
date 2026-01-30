export const LOSE_RATE_N = {
  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, loses: 0 };
  },

  step(state, value) {
    if (value == null) return;
    if (value < 0) state.loses++;
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.seen ? (state.loses / state.seen) * 100 : null;
  },
};
