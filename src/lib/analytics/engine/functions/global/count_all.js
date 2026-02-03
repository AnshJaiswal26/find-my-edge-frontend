export const COUNT_ALL = {
  init: () => ({ count: 0 }),
  step: (s) => {
    s.count++;
  },
  result: (s) => s.count,
};
