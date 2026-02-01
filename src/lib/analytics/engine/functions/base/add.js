export const ADD = {
  init() {
    return { sum: 0 };
  },

  step(state, value) {
    if (value == null) return;
    state.sum += value;
  },

  result(state) {
    return state.sum;
  },
};
