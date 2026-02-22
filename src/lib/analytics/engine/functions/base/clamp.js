export const CLAMP = {
  arity: 3,
  argTypes: ["number", "number", "number"], // value, min, max
  returnType: "number",
  semantic: { args: ["number", "number", "number"], return: "number" },
  signature: "CLAMP(expr, min, max)",
  description: "Clamp value to range",

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
