export const DAYS = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",

  semantic: {
    args: ["number"],
    return: "duration",
  },
  signature: "DAYS(n)",
  description: "Convert days to duration",

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
