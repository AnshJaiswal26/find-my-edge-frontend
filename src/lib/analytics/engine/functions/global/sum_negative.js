export const SUM_NEGATIVE = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"]],
    return: "same",
  },
  signature: "SUM_NEGATIVE(expr)",
  description: "Sum of values less than 0",

  init: () => ({ sum: 0 }),
  step: (s, v) => {
    if (v < 0) s.sum += v;
  },
  result: (s) => s.sum,
};
