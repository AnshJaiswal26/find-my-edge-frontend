export const COUNT_IF = {
  args: ["boolean"],
  returnType: "number",
  signature: "COUNT_IF(condition)",
  description: "Count of rows where condition is true",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v === 1) s.count++;
  },
  result: (s) => s.count,
};
