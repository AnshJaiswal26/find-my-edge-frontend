export const MAX = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"]],
    return: "same",
  },
  signature: "MAX(expr)",
  description: "Largest value",

  init: () => ({ max: -Infinity }),
  step: (s, v) => {
    if (v != null && v > s.max) s.max = v;
  },
  result: (s) => (s.max === -Infinity ? null : s.max),
};
