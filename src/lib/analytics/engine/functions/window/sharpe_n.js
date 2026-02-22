export const SHARPE_N = {
  arity: 2,
  argTypes: ["number", "number"],
  returnType: "number",
  semantic: { args: ["number", "number"], return: "number" },
  signature: "SHARPE_N(expr, n)",
  description: "Sharpe ratio over last N rows (risk-free = 0)",

  init(n) {
    if (n <= 1) return null;

    return {
      n,
      seen: 0,
      sum: 0,
      sumSq: 0,
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;
    state.sum += value;
    state.sumSq += value * value;

    if (state.seen >= state.n) {
      return false;
    }
  },

  result(state) {
    if (state.seen < 2) return null;

    const mean = state.sum / state.seen;
    const variance = state.sumSq / state.seen - mean * mean;

    if (variance <= 0) return null;

    const std = Math.sqrt(variance);

    return mean / std;
  },
};
