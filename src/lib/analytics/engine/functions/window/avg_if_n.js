export const AVG_IF_N = {
  arity: 3,
  argTypes: ["number", "boolean", "number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"], "boolean", "number"],
    return: "same",
  },
  signature: "AVG_IF_N(expr, condition, n)",
  description:
    "Rolling average of expr over last N rows where condition is true",

  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      sum: 0,
      count: 0,
    };
  },

  step(state, value, condition) {
    if (value == null || condition == null) return;

    state.seen++;

    if (condition) {
      state.sum += value;
      state.count++;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    if (state.count === 0) return 0;
    return state.sum / state.count;
  },
};
