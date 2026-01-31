export const WIN_RATE = {
  init() {
    return { total: 0, wins: 0 };
  },

  step(state, trade) {
    if (trade?.pnl == null) return;
    state.total++;
    if (trade.pnl > 0) state.wins++;
  },

  result(state) {
    return state.total ? (state.wins / state.total) * 100 : null;
  },
};
