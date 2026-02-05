export const RATIO = {
  init: () => ({ a: 0, b: 0 }),

  step: (s, a, b) => {
    if (a != null) s.a += a;
    if (b != null) s.b += b;
  },

  result: (s) => (s.b === 0 ? 0 : s.a / s.b),
};
