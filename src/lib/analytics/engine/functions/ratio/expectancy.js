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
      state.lossSum += Math.abs(pnl);
    }
  },

  result(state) {
    const total = state.wins + state.losses;
    if (total === 0) return 0;

    const winRate = state.wins / total;
    const avgWin = state.wins ? state.winSum / state.wins : 0;
    const avgLoss = state.losses ? state.lossSum / state.losses : 0;

    return winRate * avgWin - (1 - winRate) * avgLoss;
  },
};
