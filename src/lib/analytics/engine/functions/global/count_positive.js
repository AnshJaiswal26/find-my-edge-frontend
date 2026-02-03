export const COUNT_POSITIVE = {
  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v > 0) s.count++;
  },
  result: (s) => s.count,
};
