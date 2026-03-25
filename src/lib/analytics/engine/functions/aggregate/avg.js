export const AVG = {
  args: ["$T"],
  generics: {
    $T: ["number", "duration"],
  },
  returnType: "$T",

  signature: "AVG(expr)",
  description: "Average (mean) of values",

  init: () => ({ sum: 0, count: 0 }),
  step: (s, v) => {
    if (v != null) {
      s.sum += v;
      s.count++;
    }
  },
  result: (s) => (s.count ? s.sum / s.count : null),
};
