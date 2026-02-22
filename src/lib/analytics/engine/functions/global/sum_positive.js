export const SUM_POSITIVE = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"]],
    return: "same",
  },
  signature: "SUM_POSITIVE(expr)",
  description: "Sum of values greater than 0",

  init: () => ({ sum: 0 }),
  step: (s, v) => {
    if (v > 0) s.sum += v;
  },
  result: (s) => s.sum,
};
