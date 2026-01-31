export const LOSS_FACTOR = {
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
    const lossAbs = Math.abs(state.grossLoss);

    if (state.grossProfit === 0) return null; // avoid divide by zero

    return lossAbs / state.grossProfit;
  },
};
