export const PERCENT_OF = {
  init: () => ({ part: 0, total: 0 }),

  step: (s, part, total) => {
    if (part != null) s.part += part;
    if (total != null) s.total += total;
  },

  result: (s) => (s.total === 0 ? 0 : (s.part / s.total) * 100),
};
