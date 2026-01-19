export const AVG = {
  init() {
    return { sum: 0, count: 0 };
  },

  step(state, value) {
    if (value == null) return;
    state.sum += value;
    state.count++;
  },

  result(state) {
    return state.count === 0 ? null : state.sum / state.count;
  },
};
