export const ROUND = {
  arity: 2,
  argTypes: ["number", "number"], // value, digits
  returnType: "number",
  semantic: { args: ["number", "number"], return: "number" },
  signature: "ROUND(expr, digits)",
  description: "Round to N decimal places",

  init() {
    return { value: null };
  },

  step(state, value, decimals = 0) {
    if (value == null) return;

    const factor = Math.pow(10, Math.floor(decimals));
    state.value = Math.round(value * factor) / factor;
  },

  result(state) {
    return state.value;
  },
};
