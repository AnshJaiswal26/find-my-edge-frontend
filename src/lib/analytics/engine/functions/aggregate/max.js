export const MAX = {
  args: ["$T"],
  generics: { $T: ["number", "duration"] },
  returnType: "$T",

  signature: "MAX(expr)",
  description: "Largest value",

  init: () => ({ max: -Infinity }),
  step: (s, v) => {
    if (v != null && v > s.max) s.max = v;
  },
  result: (s) => (s.max === -Infinity ? null : s.max),
};
