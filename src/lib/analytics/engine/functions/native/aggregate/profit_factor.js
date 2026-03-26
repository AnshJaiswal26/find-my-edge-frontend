export const PROFIT_FACTOR = {
  field: "pnl",
  args: [],
  returnType: "number",
  signature: "PROFIT_FACTOR()",
  description: "Gross profit divided by gross loss",

  init() {
    return { grossProfit: 0, grossLoss: 0 };
  },

  step(state, pnl) {
    if (pnl == null) return;

    if (pnl > 0) state.grossProfit += pnl;
    else if (pnl <= 0) state.grossLoss += pnl;
  },

  result(state) {
    return state.grossLoss === 0
      ? null
      : state.grossProfit / Math.abs(state.grossLoss);
  },
};
