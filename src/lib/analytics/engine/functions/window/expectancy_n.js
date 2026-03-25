export const EXPECTANCY_N = {
  args: ["number", "number"],
  returnType: "number",
  signature: "EXPECTANCY_N(expr, n)",
  description: "Trade expectancy (win rate × avg win − loss rate × avg loss)",

  init(n) {
    if (n <= 0) return null;

    return {
      n,
      seen: 0,

      wins: 0,
      losses: 0,

      winSum: 0,
      lossSum: 0, // negative numbers
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (value > 0) {
      state.wins++;
      state.winSum += value;
    } else if (value < 0) {
      state.losses++;
      state.lossSum += value; // keep negative
    }

    // stop once window is full
    if (state.seen >= state.n) {
      return false;
    }
  },

  result(state) {
    const totalTrades = state.wins + state.losses;
    if (totalTrades === 0) return 0;

    const winRate = state.wins / totalTrades;
    const lossRate = state.losses / totalTrades;

    const avgWin = state.wins > 0 ? state.winSum / state.wins : 0;

    const avgLoss =
      state.losses > 0 ? Math.abs(state.lossSum / state.losses) : 0;

    return winRate * avgWin - lossRate * avgLoss;
  },
};
