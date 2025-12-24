export const columnsById = {
  date: {
    id: "date",
    label: "Date",
    type: "date",
    display: { format: "date" },
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

  sl: {
    id: "sl",
    label: "SL",
    type: "number",
    parse: (v) => Number(v),
  },

  pnl: {
    id: "pnl",
    label: "PnL",
    type: "computed",
    editable: false,
    dependsOn: ["exit", "entry", "qty"],
    display: { format: "currency", decimals: 2 },
    expression: {
      type: "binary",
      op: "*",
      left: {
        type: "binary",
        op: "-",
        left: { type: "column", columnId: "exit" },
        right: { type: "column", columnId: "entry" },
      },
      right: { type: "column", columnId: "qty" },
    },
    formula: "(Exit - Entry) * PnL",

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
    dependsOn: ["exit", "entry", "sl"],
    display: { format: "ratio", decimals: 2 },
    expression: {
      type: "binary",
      op: "/",
      left: {
        type: "binary",
        op: "-",
        left: { type: "column", columnId: "exit" },
        right: { type: "column", columnId: "entry" },
      },
      right: { type: "column", columnId: "sl" },
    },
    formula: "(Exit - Entry) / SL",

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
