import { createColumn } from "./model";

export const columnsById = {
  date: createColumn({
    id: "date",
    label: "Date",
    type: "date",
    editable: true,
    display: { format: "YYYY-MM-DD" },
  }),

  entryTime: createColumn({
    id: "entryTime",
    label: "Entry Time",
    type: "time",
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  exitTime: createColumn({
    id: "exitTime",
    label: "Exit Time",
    type: "time",
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  duration: createColumn({
    id: "duration",
    label: "Duration",
    type: "time computed",
    editable: false,
    dependencies: ["entryTime", "exitTime"],
    display: { format: "HH:mm:ss", decimals: 0 },
    colorRules: [
      { operator: "lessThan", value: 5, color: "var(--warning)" },
      { operator: "greaterThan", value: 30, color: "var(--info)" },
    ],
    expression: {
      type: "binary",
      op: "-",
      left: { type: "key", key: "exitTime" },
      right: { type: "key", key: "entryTime" },
    },
    formula: "[Exit Time] - [Entry Time]",
  }),

  symbol: createColumn({
    id: "symbol",
    label: "Symbol",
    type: "text",
    editable: true,
  }),

  entry: createColumn({
    id: "entry",
    label: "Entry",
    type: "number",
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  exit: createColumn({
    id: "exit",
    label: "Exit",
    type: "number",
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  qty: createColumn({
    id: "qty",
    label: "Qty",
    type: "number",
    editable: true,
    display: { format: "NUMBER" },
  }),

  targetAndSl: createColumn({
    id: "targetAndSl",
    label: "Traget/SL",
    type: "number computed",
    editable: false,
    dependencies: ["entry", "exit"],
    display: { format: "NUMBER", decimals: 2 },
    expression: {
      type: "binary",
      op: "-",
      left: { type: "key", key: "exit" },
      right: { type: "key", key: "entry" },
    },
    formula: "Exit - Entry",
  }),

  pnl: createColumn({
    id: "pnl",
    label: "PnL",
    type: "number computed",
    editable: false,
    dependencies: ["exit", "entry", "qty"],
    display: { format: "CURRENCY", decimals: 2 },
    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],
    expression: {
      type: "binary",
      op: "*",
      left: {
        type: "binary",
        op: "-",
        left: { type: "key", key: "exit" },
        right: { type: "key", key: "entry" },
      },
      right: { type: "key", key: "qty" },
    },
    formula: "(Exit - Entry) * Qty",
  }),

  riskReward: createColumn({
    id: "riskReward",
    label: "Risk-Reward",
    type: "number computed",
    editable: false,
    dependencies: ["pnl"],
    display: { format: "RATIO", decimals: 2 },
    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],
    expression: {
      type: "binary",
      op: "/",
      left: { type: "key", key: "pnl" },
      right: { type: "constant", value: 500 },
    },
    formula: "Pnl / 500",
  }),

  // emotion: createColumn({
  //   id: "emotion",
  //   label: "Emotion",
  //   type: "select",
  //   editable: true,
  //   options: ["Calm", "Fear", "Greed"],
  //   display: { format: "badge" },
  // }),
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
