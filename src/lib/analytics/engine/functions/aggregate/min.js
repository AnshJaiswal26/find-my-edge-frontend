export const MIN = {
  args: ["$T"],
  generics: { $T: ["number", "duration"] },
  returnType: "$T",
  signature: "MIN(expr)",
  description: "Smallest value",

  init: () => ({ min: Infinity }),
  step: (s, v) => {
    if (v != null && v < s.min) s.min = v;
  },
  result: (s) => (s.min === Infinity ? null : s.min),
};
