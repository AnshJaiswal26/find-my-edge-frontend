export const MAX = {
  init: () => ({ max: -Infinity }),
  step: (s, v) => {
    if (v != null && v > s.max) s.max = v;
  },
  result: (s) => (s.max === -Infinity ? null : s.max),
};
