export const STDDEV = {
  arity: 1,
  argTypes: ["number"],
  returnType: "number",
  semantic: { args: ["number"], return: "number" },
  signature: "STDDEV(expr)",
  description: "Standard deviation of values",

  init: () => ({ n: 0, mean: 0, M2: 0 }),
  step: (s, x) => {
    if (x == null) return;
    s.n++;
    const delta = x - s.mean;
    s.mean += delta / s.n;
    s.M2 += delta * (x - s.mean);
  },
  result: (s) => (s.n > 1 ? Math.sqrt(s.M2 / s.n) : 0),
};
