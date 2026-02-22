export const PERCENT_OF = {
  arity: 2,
  argTypes: ["number", "number"],
  returnType: "number",
  semantic: { args: ["number", "number"], return: "number" },
  signature: "PERCENT_OF(part, total)",
  description: "What percent one value is of another",

  init: () => ({ part: 0, total: 0 }),

  step: (s, part, total) => {
    if (part != null) s.part += part;
    if (total != null) s.total += total;
  },

  result: (s) => (s.total === 0 ? 0 : (s.part / s.total) * 100),
};
