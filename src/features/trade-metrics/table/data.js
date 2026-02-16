import { createSchema, SCHEMA_SOURCE } from "@lib/analytics/schema";

export const columnsById = {
  date: createSchema({
    id: "date",
    label: "Date",
    type: "date",
    source: SCHEMA_SOURCE.SYSTEM,
    semanticType: "date",
    editable: true,
    display: { format: "YYYY-MM-DD" },
  }),

  entryTime: createSchema({
    id: "entryTime",
    label: "Entry Time",
    type: "time",
    source: SCHEMA_SOURCE.SYSTEM,
    semanticType: "time",
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  exitTime: createSchema({
    id: "exitTime",
    label: "Exit Time",
    type: "time",
    source: SCHEMA_SOURCE.SYSTEM,
    semanticType: "time",
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  duration: createSchema({
    id: "duration",
    label: "Duration",
    type: "time computed",
    semanticType: "duration", // important
    source: SCHEMA_SOURCE.COMPUTED,
    editable: false,
    dependencies: ["entryTime", "exitTime"],
    display: { format: "HH:mm:ss", decimals: 0 },
    colorRules: [
      { operator: "lessThan", value: 5, color: "var(--warning)" },
      { operator: "greaterThan", value: 30, color: "var(--info)" },
    ],
    ast: {
      type: "binary",
      op: "-",
      left: { type: "key", key: "exitTime" },
      right: { type: "key", key: "entryTime" },
    },
    formula: "Exit Time - Entry Time",
  }),

  symbol: createSchema({
    id: "symbol",
    label: "Symbol",
    source: SCHEMA_SOURCE.SYSTEM,
    type: "text",
    semanticType: "string",
    editable: true,
  }),

  entry: createSchema({
    id: "entry",
    label: "Entry",
    type: "number",
    semanticType: "number",
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  exit: createSchema({
    id: "exit",
    label: "Exit",
    type: "number",
    semanticType: "number",
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  qty: createSchema({
    id: "qty",
    label: "Qty",
    type: "number",
    semanticType: "number",
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "NUMBER" },
  }),

  targetAndSl: createSchema({
    id: "targetAndSl",
    label: "Traget/SL",
    type: "number computed",
    semanticType: "number",
    source: SCHEMA_SOURCE.COMPUTED,
    editable: false,
    dependencies: ["entry", "exit"],
    display: { format: "NUMBER", decimals: 2 },
    ast: {
      type: "binary",
      op: "-",
      left: { type: "key", key: "exit" },
      right: { type: "key", key: "entry" },
    },
    formula: "Exit - Entry",
  }),

  pnl: createSchema({
    id: "pnl",
    label: "PnL",
    type: "number computed",
    semanticType: "number",
    source: SCHEMA_SOURCE.COMPUTED,
    editable: false,
    dependencies: ["exit", "entry", "qty"],
    display: { format: "CURRENCY", decimals: 2 },
    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],
    ast: {
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

  riskReward: createSchema({
    id: "riskReward",
    label: "Risk-Reward",
    type: "number computed",
    semanticType: "number",
    source: SCHEMA_SOURCE.COMPUTED,
    editable: false,
    dependencies: ["pnl"],
    display: { format: "RATIO", decimals: 2 },
    colorRules: [
      { operator: "greaterThan", value: 0, color: "var(--success)" },
      { operator: "lessThan", value: 0, color: "var(--error)" },
    ],
    ast: {
      type: "binary",
      op: "/",
      left: { type: "key", key: "pnl" },
      right: { type: "constant", value: 500 },
    },
    formula: "PnL / 500",
  }),

  emotion: createSchema({
    id: "emotion",
    label: "Emotion",
    type: "select",
    semanticType: "string",
    editable: true,
    options: ["Calm", "Fear", "Greed"],
    display: { format: "badge" },
  }),
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
