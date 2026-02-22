export const SECONDS = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: ["number"],
    return: "duration",
  },
  signature: "SECONDS(n)",
  description: "Convert seconds to duration",

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
