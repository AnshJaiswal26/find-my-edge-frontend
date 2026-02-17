export const DAYS = {
  init() {
    return { value: null };
  },

  step(state, value) {
    if (value == null) return;

    state.value = value * 24 * 60 * 60;
  },

  result(state) {
    return state.value;
  },
};
