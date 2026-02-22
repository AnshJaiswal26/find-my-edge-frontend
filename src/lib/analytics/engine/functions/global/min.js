export const MIN = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"]],
    return: "same",
  },
  signature: "MIN(expr)",
  description: "Smallest value",

  init: () => ({ min: Infinity }),
  step: (s, v) => {
    if (v != null && v < s.min) s.min = v;
  },
  result: (s) => (s.min === Infinity ? null : s.min),
};
