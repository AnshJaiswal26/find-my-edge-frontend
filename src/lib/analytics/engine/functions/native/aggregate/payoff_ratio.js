export const PAYOFF_RATIO = {
  field: "pnl",

  argTypes: [],
  returnType: "number",
  semantic: { args: [], return: "number" },
  signature: "PAYOFF_RATIO()",
  description: "Average win divided by average loss",

  init() {
    return { winSum: 0, winCount: 0, lossSum: 0, lossCount: 0 };
  },

  step(state, pnl) {
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
