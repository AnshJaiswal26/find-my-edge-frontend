export const EDGE_RATIO = {
  init: () => ({ win: 0, loss: 0 }),

  step: (s, win, loss) => {
    if (win != null) s.win += win;
    if (loss != null) s.loss += loss;
  },

  result: (s) => (s.loss === 0 ? 0 : (s.win - s.loss) / s.loss),
};
