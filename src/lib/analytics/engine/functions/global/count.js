export const COUNT = {
  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v != null) s.count++;
  },
  result: (s) => s.count,
};
