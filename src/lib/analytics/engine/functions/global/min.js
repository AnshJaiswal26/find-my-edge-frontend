export const MIN = {
  init: () => ({ min: Infinity }),
  step: (s, v) => {
    if (v != null && v < s.min) s.min = v;
  },
  result: (s) => (s.min === Infinity ? null : s.min),
};
