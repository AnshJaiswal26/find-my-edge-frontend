export const SUM_IF = {
  init() {
    return { sum: 0 };
  },

  step(state, value, condition) {
    if (value != null && condition) {
      state.sum += value;
    }
  },

  result(state) {
    return state.sum;
  },
};
