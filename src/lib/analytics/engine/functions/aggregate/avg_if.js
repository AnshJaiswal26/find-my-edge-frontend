export const AVG_IF = {
  args: ["$T", "boolean"],
  generics: {
    $T: ["number", "duration"],
  },
  returnType: "$T",

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
