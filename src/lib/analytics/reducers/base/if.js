export const IF = {
  init() {
    return { value: null };
  },

  step(state, value) {
    state.value = value;
  },

  result(state) {
    return state.value;
  },
};
