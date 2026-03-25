export const RATE = {
  args: ["boolean"],
  returnType: "number",
  signature: "RATE(condition)",
  description: "Percentage of rows where condition is true",

  init() {
    return { total: 0, trueCount: 0 };
  },

  step(state, condition) {
    state.total++;
    if (condition) state.trueCount++;
  },

  result(state) {
    return state.total === 0 ? 0 : state.trueCount / state.total;
  },
};
