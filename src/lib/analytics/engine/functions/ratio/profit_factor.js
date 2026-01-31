export const PROFIT_FACTOR = {
  init() {
    return { grossProfit: 0, grossLoss: 0 };
  },

  step(state, trade) {
    const pnl = trade?.pnl;
    if (pnl == null) return;

    if (pnl > 0) state.grossProfit += pnl;
    else if (pnl < 0) state.grossLoss += pnl;
  },

  result(state) {
    return state.grossLoss === 0
      ? null
      : state.grossProfit / Math.abs(state.grossLoss);
  },
};
