export const COALESCE = {
  init() {
    return { value: null, done: false };
  },

  step(state, value) {
    if (state.done) return;
    if (value != null) {
      state.value = value;
      state.done = true;
    }
  },

  result(state) {
    return state.value;
  },
};
