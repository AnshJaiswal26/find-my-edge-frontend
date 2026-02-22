export const SUM_IF_N = {
  arity: 3,
  argTypes: ["number", "boolean", "number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"], "boolean", "number"],
    return: "same",
  },
  signature: "SUM_IF_N(expr, condition, n)",
  description: "Rolling sum of expr over last N rows where condition is true",

  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      sum: 0,
    };
  },

  step(state, value, condition) {
    if (value == null || condition == null) return;

    state.seen++;

    if (condition) {
      state.sum += value;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.sum;
  },
};
