export const SUM_IF = {
  args: ["$T", "boolean"],
  generics: { $T: ["number", "duration"] },
  returnType: "$T",
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
