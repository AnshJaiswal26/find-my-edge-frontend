export const columnsById = {
  date: {
    id: "date",
    label: "Date",
    type: "date",
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "YYYY-MM-DD" },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  entryTime: {
    id: "entryTime",
    label: "Entry Time",
    type: "time",
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "HH:mm" },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  exitTime: {
    id: "exitTime",
    label: "Exit Time",
    type: "time",
    mode: "row",

    editable: true,

    dependencies: [],

    display: { format: "HH:mm" },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  duration: {
    id: "duration",
    label: "Duration",
    type: "computed",
    mode: "row",

    editable: false,

    dependencies: ["entryTime", "exitTime"],

    display: { format: "NUMBER", decimals: 0 },

    colorRules: [
      { operator: "lessThan", value: 5, color: "var(--warning)" },
      { operator: "greaterThan", value: 30, color: "var(--info)" },
    ],

    initialValue: 0,

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
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "text" },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  entry: {
    id: "entry",
    label: "Entry",
    type: "number",
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER", decimals: 2 },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  exit: {
    id: "exit",
    label: "Exit",
    type: "number",
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER", decimals: 2 },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  qty: {
    id: "qty",
    label: "Qty",
    type: "number",
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER" },

    colorRules: [],

    initialValue: 0,

    expression: null,
    formula: null,
  },

  sl: {
    id: "sl",
    label: "SL",
    type: "number",
    mode: "row",
    editable: true,

    dependencies: [],

    display: { format: "NUMBER", decimals: 2 },

    colorRules: [],

    initialValue: 0,

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
    initialValue: 0,

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
    mode: "row",

    editable: false,

    dependencies: ["pnl", 500],

    display: { format: "RATIO", decimals: 2 },

    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],

    initialValue: 0,

    expression: {
      type: "binary",
      op: "/",
      left: { type: "column", columnId: "pnl" },
      right: { type: "constant", value: 500 },
    },
    formula: "Pnl / 500",
  },

  emotion: {
    id: "emotion",
    label: "Emotion",
    type: "select",
    mode: "row",

    editable: true,

    dependencies: [],

    options: ["Calm", "Fear", "Greed"],

    display: { format: "badge" },

    colorRules: [],

    initialValue: 0,
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
