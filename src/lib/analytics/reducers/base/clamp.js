export const CLAMP = {
  init() {
    return { value: null };
  },

  step(state, value, min, max) {
    if (value == null || min == null || max == null) return;
    state.value = Math.min(Math.max(value, min), max);
  },

  result(state) {
    return state.value;
  },
};
