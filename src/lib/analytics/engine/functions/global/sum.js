export const SUM = {
  init: () => ({ sum: 0 }),
  step: (s, v) => {
    if (v != null) s.sum += v;
  },
  result: (s) => s.sum,
};
