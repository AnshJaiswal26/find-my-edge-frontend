export const ABS = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: { args: ["number"], return: "number" },
  signature: "ABS(expr)",
  description: "Absolute value",

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
