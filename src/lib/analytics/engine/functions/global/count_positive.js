export const COUNT_POSITIVE = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: { args: ["number"], return: "number" },
  signature: "COUNT_POSITIVE(expr)",
  description: "Count of values greater than 0",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v > 0) s.count++;
  },
  result: (s) => s.count,
};
