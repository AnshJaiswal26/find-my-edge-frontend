export const COUNT_POSITIVE = {
  args: ["number"],
  returnType: "number",
  signature: "COUNT_POSITIVE(expr)",
  description: "Count of values greater than 0",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v > 0) s.count++;
  },
  result: (s) => s.count,
};
