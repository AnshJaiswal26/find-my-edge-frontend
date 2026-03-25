export const STREAK_N = {
  args: ["boolean", "number"],
  returnType: "number",
  signature: "STREAK_N(condition, n)",
  description: "Longest consecutive TRUE streak within last N rows",

  init(n) {
    if (n <= 0) return null;
    return {
      n,
      seen: 0,
      current: 0,
      max: 0,
    };
  },

  step(state, value) {
    if (value == null) return;

    state.seen++;

    if (value === 1) {
      state.current++;
      if (state.current > state.max) {
        state.max = state.current;
      }
    } else {
      state.current = 0;
    }

    if (state.seen >= state.n) return false;
  },

  result(state) {
    return state.max;
  },
};
