export const WIN_RATE = {
  field: "pnl",
  args: [],
  returnType: "number",
  signature: "WIN_RATE()",
  description: "Winning trades divided by total trades",

  init() {
    return { total: 0, wins: 0 };
  },

  step(state, pnl) {
    if (pnl == null) return null;
    state.total++;
    if (pnl > 0) state.wins++;
  },

  result(state) {
    return state.total ? (state.wins / state.total) * 100 : null;
  },
};
