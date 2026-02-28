export const COUNT_NEGATIVE = {
  argTypes: ["number"],
  returnType: "number",
  semantic: { args: ["number"], return: "number" },
  signature: "COUNT_NEGATIVE(expr)",
  description: "Count of values less than 0",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v < 0) s.count++;
  },
  result: (s) => s.count,
};
