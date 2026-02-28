export const SUM = {
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: [["number", "duration"]],
    return: "same",
  },
  signature: "SUM(expr)",
  description: "Sum of all non-null values",

  init: () => ({ sum: 0 }),
  step: (s, v) => {
    if (v != null) s.sum += v;
  },
  result: (s) => s.sum,
};
