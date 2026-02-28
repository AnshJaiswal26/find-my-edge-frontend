export const FACTOR = {
  argTypes: ["number", "number"],
  returnType: "number",
  semantic: { args: ["number", "number"], return: "number" },
  signature: "FACTOR(a, b)",
  description: "Magnitude comparison between two values (a / b)",

  init: () => ({ a: 0, b: 0 }),

  step: (s, a, b) => {
    if (a != null) s.a += a;
    if (b != null) s.b += b;
  },

  result: (s) => (s.b === 0 ? 0 : s.a / s.b),
};
