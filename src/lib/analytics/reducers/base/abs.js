export const ABS = {
  init() {
    return { value: null };
  },

  step(state, value) {
    if (value == null) return;
    state.value = Math.abs(value);
  },

  result(state) {
    return state.value;
  },
};
