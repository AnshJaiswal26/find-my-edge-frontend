export const LOSS_RATE = {
  init() {
    return { total: 0, losses: 0 };
  },

  step(state, trade) {
    if (trade?.pnl == null) return;
    state.total++;
    if (trade.pnl < 0) state.losses++;
  },

  result(state) {
    return state.total ? (state.losses / state.total) * 100 : null;
  },
};
