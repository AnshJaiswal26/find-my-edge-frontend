import {
  createSchema,
  SCHEMA_SOURCE,
  SCHEMA_TYPES,
  SEMANTIC_TYPES,
} from "@lib/analytics/schema";

export const columnsById = {
  date: createSchema({
    id: "date",
    label: "Date",
    type: SCHEMA_TYPES.DATE,
    semanticType: SEMANTIC_TYPES.DATE,
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "YYYY-MM-DD" },
  }),

  entryTime: createSchema({
    id: "entryTime",
    label: "Entry Time",
    type: SCHEMA_TYPES.TIME,
    semanticType: SEMANTIC_TYPES.TIME,
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  exitTime: createSchema({
    id: "exitTime",
    label: "Exit Time",
    type: SCHEMA_TYPES.TIME,
    semanticType: SEMANTIC_TYPES.TIME,
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  duration: createSchema({
    id: "duration",
    label: "Duration",
    type: SCHEMA_TYPES.DURATION,
    semanticType: SEMANTIC_TYPES.DURATION, // important
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
    type: SCHEMA_TYPES.TEXT,
    semanticType: SEMANTIC_TYPES.STRING,
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
  }),

  entry: createSchema({
    id: "entry",
    label: "Entry",
    type: SCHEMA_TYPES.NUMBER,
    semanticType: SEMANTIC_TYPES.NUMBER,
    source: SCHEMA_SOURCE.SYSTEM,
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  exit: createSchema({
    id: "exit",
    label: "Exit",
    type: SCHEMA_TYPES.NUMBER,
    semanticType: SEMANTIC_TYPES.NUMBER,
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
    type: SCHEMA_TYPES.NUMBER,
    semanticType: SEMANTIC_TYPES.NUMBER,
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
    type: SCHEMA_TYPES.NUMBER,
    semanticType: SEMANTIC_TYPES.NUMBER,
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
    type: SCHEMA_TYPES.NUMBER,
    semanticType: SEMANTIC_TYPES.NUMBER,
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
    type: SCHEMA_TYPES.SELECT,
    semanticType: SEMANTIC_TYPES.STRING,
    editable: true,
    options: ["Calm", "Fear", "Greed"],
    display: { format: "badge" },
  }),
};

export const columnsOrder = [
  "date",
  "symbol",
  "entry",
  "exit",
  "qty",
  "pnl",
  "emotion",
];
