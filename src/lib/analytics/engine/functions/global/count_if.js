export const COUNT_IF = {
  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v === 1) s.count++;
  },
  result: (s) => s.count,
};
