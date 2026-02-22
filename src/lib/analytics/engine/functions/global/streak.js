export const STREAK = {
  arity: 1,
  argTypes: ["boolean"],
  returnType: "number",
  semantic: { args: ["boolean"], return: "number" },
  signature: "STREAK(condition)",
  description: "Longest consecutive TRUE streak over all rows",

  init() {
    return { max: 0, current: 0 };
  },

  step(state, condition) {
    if (condition) {
      state.current++;
      state.max = Math.max(state.max, state.current);
    } else {
      state.current = 0;
    }
  },

  result(state) {
    return state.max;
  },
};
