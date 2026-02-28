export const SUM_IF = {
  argTypes: ["number", "boolean"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"], "boolean"],
    return: "same",
  },
  signature: "SUM_IF(expr, condition)",
  description: "Sum of expr where condition is true",

  init() {
    return { sum: 0 };
  },

  step(state, value, condition) {
    if (value != null && condition) {
      state.sum += value;
    }
  },

  result(state) {
    return state.sum;
  },
};
