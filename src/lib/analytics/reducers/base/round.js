export const ROUND = {
  init() {
    return { value: null };
  },

  step(state, value, decimals = 0) {
    if (value == null) return;

    const factor = Math.pow(10, Math.floor(decimals));
    state.value = Math.round(value * factor) / factor;
  },

  result(state) {
    return state.value;
  },
};
