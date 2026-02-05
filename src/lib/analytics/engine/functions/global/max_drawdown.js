export const MAX_DRAWDOWN = {
  init() {
    return { peak: -Infinity, equity: 0, maxDD: 0 };
  },

  step(state, [value]) {
    if (value == null) return;

    state.equity += value;
    state.peak = Math.max(state.peak, state.equity);
    const dd = state.peak - state.equity;
    state.maxDD = Math.max(state.maxDD, dd);
  },

  result(state) {
    return state.maxDD;
  },
};
