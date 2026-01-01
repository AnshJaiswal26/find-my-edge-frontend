export const columnsById = {
  date: {
    id: "date",
    label: "Date",
    type: "date",
    editable: true,

    dependencies: [],

    display: { format: "YYYY-MM-DD" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  entryTime: {
    id: "entryTime",
    label: "Entry Time",
    type: "time",
    editable: true,

    dependencies: [],

    display: { format: "HH:mm" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  exitTime: {
    id: "exitTime",
    label: "Exit Time",
    type: "time",
    editable: true,

    dependencies: [],

    display: { format: "HH:mm" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  duration: {
    id: "duration",
    label: "Duration",
    type: "computed",
    editable: false,

    dependencies: ["entryTime", "exitTime"],

    display: { format: "NUMBER", decimals: 0 },

    colorRules: [
      { operator: "lessThan", value: 5, color: "var(--warning)" },
      { operator: "greaterThan", value: 30, color: "var(--info)" },
    ],

    // custom expression handled in evaluator
    expression: {
      type: "duration",
      from: { type: "column", columnId: "entryTime" },
      to: { type: "column", columnId: "exitTime" },
    },

    formula: "(Exit Time - Entry Time) in minutes",
  },

  symbol: {
    id: "symbol",
    label: "Symbol",
    type: "text",
    editable: true,

    dependencies: [],

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

    dependencies: [],

    display: { format: "NUMBER", decimals: 2 },

    colorRules: [],

    expression: null,
    formula: null,
  },

  exit: {
    id: "exit",
    label: "Exit",
    type: "number",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER", decimals: 2 },

    colorRules: [],

    expression: null,
    formula: null,
  },

  qty: {
    id: "qty",
    label: "Qty",
    type: "number",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER" },

    colorRules: [],

    expression: null,
    formula: null,
  },

  sl: {
    id: "sl",
    label: "SL",
    type: "number",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER", decimals: 2 },

    colorRules: [],

    expression: null,
    formula: null,
  },

  pnl: {
    id: "pnl",
    label: "PnL",

    /* ---------- column role ---------- */
    type: "computed", // replaces type
    mode: "row", //  (row | cumulative | aggregate)

    editable: false,

    /* ---------- expression ---------- */
    formula: "(Exit - Entry) * Qty", // user input
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

    dependencies: ["exit", "entry", "qty"], // auto-generated

    /* ---------- cumulative only ---------- */
    initialValue: 0, // only for cumulative columns

    /* ---------- display ---------- */
    display: { format: "CURRENCY", decimals: 2 },

    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],
  },

  rr: {
    id: "rr",
    label: "Risk-Reward",
    type: "computed",
    editable: false,
    dependencies: ["exit", "entry", "sl"],
    display: { format: "RATIO", decimals: 2 },
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

    dependencies: [],

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
