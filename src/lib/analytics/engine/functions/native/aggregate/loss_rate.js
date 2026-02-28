export const LOSS_RATE = {
  argTypes: [],
  returnType: "number",
  semantic: { args: [], return: "number" },
  signature: "LOSS_RATE()",
  description: "Losing trades divided by total trades",

  field: "pnl",

  init() {
    return { total: 0, losses: 0 };
  },

  step(state, pnl) {
    if (pnl == null) return;
    state.total++;
    if (pnl < 0) state.losses++;
  },

  result(state) {
    return state.total ? (state.losses / state.total) * 100 : null;
  },
};
