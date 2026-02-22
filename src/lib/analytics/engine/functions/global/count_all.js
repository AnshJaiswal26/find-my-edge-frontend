export const COUNT_ALL = {
  arity: 0,
  argTypes: [],
  returnType: "number",
  semantic: { args: [], return: "number" },
  signature: "COUNT_ALL()",
  description: "Total number of records",

  init: () => ({ count: 0 }),
  step: (s) => {
    s.count++;
  },
  result: (s) => s.count,
};
