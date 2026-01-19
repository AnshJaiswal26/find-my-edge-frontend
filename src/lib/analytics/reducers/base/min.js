export const MIN = {
  init() {
    return { min: null };
  },

  step(state, value) {
    if (value == null) return;
    state.min = state.min === null ? value : Math.min(state.min, value);
  },

  result(state) {
    return state.min;
  },
};
