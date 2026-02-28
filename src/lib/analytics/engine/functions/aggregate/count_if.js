export const COUNT_IF = {
  argTypes: ["boolean"],
  returnType: "number",
  semantic: { args: ["boolean"], return: "number" },
  signature: "COUNT_IF(condition)",
  description: "Count of rows where condition is true",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v === 1) s.count++;
  },
  result: (s) => s.count,
};
