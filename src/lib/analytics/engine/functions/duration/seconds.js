export const SECONDS = {
  init() {
    return { value: null };
  },

  step(state, value) {
    if (value == null) return;

    state.value = value;
  },

  result(state) {
    return state.value;
  },
};
