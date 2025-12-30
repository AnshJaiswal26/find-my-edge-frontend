export const columnsById = {
  date: {
    id: "date",
    label: "Date",
    type: "date",
    editable: true,

    dependsOn: [],

    parse: (v) => v,

    display: { format: "date" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  symbol: {
    id: "symbol",
    label: "Symbol",
    type: "text",
    editable: true,

    dependsOn: [],

    parse: (v) => v,

    display: { format: "text" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  entry: {
    id: "entry",
    label: "Entry",
    type: "number",
    editable: true,

    dependsOn: [],

    parse: (v) => Number(v),
    validate: (v) => (isNaN(v) ? "Invalid entry" : null),

    display: { format: "number", decimals: 2 },

    colorRules: [],

    expression: null,
    formula: null,
  },

  exit: {
    id: "exit",
    label: "Exit",
    type: "number",
    editable: true,

    dependsOn: [],

    parse: (v) => Number(v),

    display: { format: "number", decimals: 2 },

    colorRules: [],

    expression: null,
    formula: null,
  },

  qty: {
    id: "qty",
    label: "Qty",
    type: "number",
    editable: true,

    dependsOn: [],

    parse: (v) => Number(v),

    display: { format: "number" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  sl: {
    id: "sl",
    label: "SL",
    type: "number",
    editable: true,

    dependsOn: [],

    parse: (v) => Number(v),

    display: { format: "number", decimals: 2 },

    colorRules: [],

    expression: null,
    formula: null,
  },

  pnl: {
    id: "pnl",
    label: "PnL",
    type: "computed",
    editable: false,
    dependsOn: ["exit", "entry", "qty"],
    display: { format: "currency", decimals: 2 },
    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],
    startValue: 0,
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
    formula: "(Exit - Entry) * Qty",
  },

  rr: {
    id: "rr",
    label: "Risk-Reward",
    type: "computed",
    editable: false,
    dependsOn: ["exit", "entry", "sl"],
    display: { format: "ratio", decimals: 2 },
    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--warning)" },
    ],
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
  },

  emotion: {
    id: "emotion",
    label: "Emotion",
    type: "select",
    editable: true,

    dependsOn: [],

    options: ["Calm", "Fear", "Greed"],

    parse: (v) => v,

    display: { format: "badge" },

    colorRules: [],

    expression: null,
    formula: null,
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
