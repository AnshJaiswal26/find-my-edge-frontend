export const SUM = {
  args: ["$T"],
  generics: { $T: ["number", "duration"] },
  returnType: "$T",
  signature: "SUM(expr)",
  description: "Sum of all non-null values",

  init: () => ({ sum: 0 }),
  step: (s, v) => {
    if (v != null) s.sum += v;
  },
  result: (s) => s.sum,
};
