export const COUNT_ALL = {
  args: [],
  returnType: "number",
  signature: "COUNT_ALL()",
  description: "Total number of records",

  init: () => ({ count: 0 }),
  step: (s) => {
    s.count++;
  },
  result: (s) => s.count,
};
