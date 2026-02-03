export const COUNT_NEGATIVE = {
  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v < 0) s.count++;
  },
  result: (s) => s.count,
};
