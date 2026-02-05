export const VOLATILITY = {
  init() {
    return { count: 0, mean: 0, m2: 0 };
  },

  step(state, [value]) {
    if (value == null) return;

    state.count++;
    const delta = value - state.mean;
    state.mean += delta / state.count;
    state.m2 += delta * (value - state.mean);
  },

  result(state) {
    if (state.count < 2) return 0;
    return Math.sqrt(state.m2 / (state.count - 1));
  },
};
