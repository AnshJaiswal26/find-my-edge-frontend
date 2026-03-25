export const COUNT_NEGATIVE = {
  args: ["number"],
  returnType: "number",
  signature: "COUNT_NEGATIVE(expr)",
  description: "Count of values less than 0",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v < 0) s.count++;
  },
  result: (s) => s.count,
};
