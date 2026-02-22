export const AVG_IF = {
  arity: 2,
  argTypes: ["number", "boolean"],
  semantic: {
    args: [["number", "duration"], "boolean"],
    return: "same",
  },
  returnType: "number",
  signature: "AVG_IF(expr, condition)",
  description: "Average of expr where condition is true",

  init() {
    return { sum: 0, count: 0 };
  },

  step(state, value, condition) {
    if (value != null && condition) {
      state.sum += value;
      state.count++;
    }
  },

  result(state) {
    return state.count === 0 ? 0 : state.sum / state.count;
  },
};
