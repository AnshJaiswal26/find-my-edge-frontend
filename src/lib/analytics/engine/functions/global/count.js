export const COUNT = {
  arity: 1,
  argTypes: ["any"],
  returnType: "number",
  semantic: { args: ["any"], return: "number" },
  signature: "COUNT(expr)",
  description: "Count of non-null values",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v != null) s.count++;
  },
  result: (s) => s.count,
};
