export const MINUTES = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: ["number"],
    return: "duration",
  },
  signature: "MINUTES(n)",
  description: "Convert minutes to duration",

  init() {
    return { value: null };
  },

  step(state, value) {
    if (value == null) return;

    state.value = value * 60;
  },

  result(state) {
    return state.value;
  },
};
