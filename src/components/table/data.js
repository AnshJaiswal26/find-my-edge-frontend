// data/columns.ts

export const columnsById = {
  date: {
    id: "date",
    label: "Date",
    type: "date",
    parse: (v) => v,
  },

  symbol: {
    id: "symbol",
    label: "Symbol",
    type: "text",
    parse: (v) => v,
  },

  entry: {
    id: "entry",
    label: "Entry",
    type: "number",
    parse: (v) => Number(v),
    validate: (v) => (isNaN(v) ? "Invalid entry" : null),
  },

  exit: {
    id: "exit",
    label: "Exit",
    type: "number",
    parse: (v) => Number(v),
  },

  qty: {
    id: "qty",
    label: "Qty",
    type: "number",
    parse: (v) => Number(v),
  },

  pnl: {
    id: "pnl",
    label: "PnL",
    type: "computed",
    editable: false,
    display: { format: "currency", decimals: 0 },
    conditionalStyle(value) {
      if (value == null) return "muted";
      if (value > 0) return "profit";
      if (value < 0) return "loss";
      return "neutral";
    },
  },

  rr: {
    id: "rr",
    label: "Risk-Reward",
    type: "computed",
    editable: false,
    display: { format: "ratio", decimals: 0 },
    conditionalStyle(value) {
      if (value == null) return "muted";
      if (value > 0) return "profit";
      if (value < 0) return "loss";
      return "neutral";
    },
  },

  emotion: {
    id: "emotion",
    label: "Emotion",
    type: "select",
    options: ["Calm", "Fear", "Greed"],
    parse: (v) => v,
  },
};

export const columnOrder = [
  "date",
  "symbol",
  "entry",
  "exit",
  "qty",
  "pnl",
  "emotion",
];
