export const EXPECTANCY = {
  init() {
    return { wins: 0, losses: 0, winSum: 0, lossSum: 0 };
  },

  step(state, trade) {
    const pnl = trade?.pnl;
    if (pnl == null) return;

    if (pnl > 0) {
      state.wins++;
      state.winSum += pnl;
    } else if (pnl < 0) {
      state.losses++;
      state.lossSum += pnl;
    }
  },

  result(state) {
    const total = state.wins + state.losses;
    if (!total || !state.wins || !state.losses) return null;

    const winRate = state.wins / total;
    const lossRate = state.losses / total;
    const avgWin = state.winSum / state.wins;
    const avgLoss = Math.abs(state.lossSum / state.losses);

    return winRate * avgWin - lossRate * avgLoss;
  },
};
