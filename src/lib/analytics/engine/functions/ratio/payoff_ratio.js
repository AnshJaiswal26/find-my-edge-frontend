export const PAYOFF_RATIO = {
  init() {
    return { winSum: 0, winCount: 0, lossSum: 0, lossCount: 0 };
  },

  step(state, trade) {
    const pnl = trade?.pnl;
    if (pnl == null) return;

    if (pnl > 0) {
      state.winSum += pnl;
      state.winCount++;
    } else if (pnl < 0) {
      state.lossSum += pnl;
      state.lossCount++;
    }
  },

  result(state) {
    if (!state.winCount || !state.lossCount) return null;

    const avgWin = state.winSum / state.winCount;
    const avgLoss = Math.abs(state.lossSum / state.lossCount);

    return avgLoss === 0 ? null : avgWin / avgLoss;
  },
};
