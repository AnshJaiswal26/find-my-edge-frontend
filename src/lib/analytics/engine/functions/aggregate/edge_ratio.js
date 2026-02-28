export const EDGE_RATIO = {
  argTypes: ["number", "number"],
  returnType: "number",
  semantic: { args: ["number", "number"], return: "number" },
  signature: "EDGE_RATIO(win, loss)",
  description: "Net edge ratio between two opposing values",

  init: () => ({ win: 0, loss: 0 }),

  step: (s, win, loss) => {
    if (win != null) s.win += win;
    if (loss != null) s.loss += loss;
  },

  result: (s) => (s.loss === 0 ? 0 : (s.win - s.loss) / s.loss),
};
