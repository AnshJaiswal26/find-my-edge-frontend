export const SUM_NEGATIVE = {
  init: () => ({ sum: 0 }),
  step: (s, v) => {
    if (v < 0) s.sum += v;
  },
  result: (s) => s.sum,
};
