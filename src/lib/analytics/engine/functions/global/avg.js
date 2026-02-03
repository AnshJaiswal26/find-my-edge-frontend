export const AVG = {
  init: () => ({ sum: 0, count: 0 }),
  step: (s, v) => {
    if (v != null) {
      s.sum += v;
      s.count++;
    }
  },
  result: (s) => (s.count ? s.sum / s.count : null),
};
