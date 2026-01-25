export const MAX = {
  init() {
    return { max: null };
  },

  step(state, value) {
    if (value == null) return;
    state.max = state.max === null ? value : Math.max(state.max, value);
  },

  result(state) {
    return state.max;
  },
};
