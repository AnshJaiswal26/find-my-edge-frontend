export const WIN_RATE_N = {
  init(n) {
    if (n <= 0) return null;
    return { n, seen: 0, wins: 0 };
  },

  step(state, value) {
    if (value == null) return;
    if (value > 0) state.wins++;
    if (++state.seen >= state.n) return false;
  },

  result(state) {
    return state.seen ? (state.wins / state.seen) * 100 : null;
  },
};
