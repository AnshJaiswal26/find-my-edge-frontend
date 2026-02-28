import {
  createSchema,
  SchemaSource,
  SchemaType,
  SemanticType,
} from "@lib/analytics/schema";

export const columnsById = {
  date: createSchema({
    id: "date",
    label: "Date",
    type: SchemaType.DATE,
    semanticType: SemanticType.DATE,
    source: SchemaSource.SYSTEM,
    editable: true,
    display: { format: "YYYY-MM-DD" },
  }),

  entryTime: createSchema({
    id: "entryTime",
    label: "Entry Time",
    type: SchemaType.TIME,
    semanticType: SemanticType.TIME,
    source: SchemaSource.SYSTEM,
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  exitTime: createSchema({
    id: "exitTime",
    label: "Exit Time",
    type: SchemaType.TIME,
    semanticType: SemanticType.TIME,
    source: SchemaSource.SYSTEM,
    editable: true,
    display: { format: "hh:mm:ss A" },
  }),

  duration: createSchema({
    id: "duration",
    label: "Duration",
    type: SchemaType.DURATION,
    semanticType: SemanticType.DURATION, // important
    source: SchemaSource.COMPUTED,
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
    type: SchemaType.TEXT,
    semanticType: SemanticType.STRING,
    source: SchemaSource.SYSTEM,
    editable: true,
  }),

  entry: createSchema({
    id: "entry",
    label: "Entry",
    type: SchemaType.NUMBER,
    semanticType: SemanticType.NUMBER,
    source: SchemaSource.SYSTEM,
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  exit: createSchema({
    id: "exit",
    label: "Exit",
    type: SchemaType.NUMBER,
    semanticType: SemanticType.NUMBER,
    source: SchemaSource.SYSTEM,
    editable: true,
    display: { format: "NUMBER", decimals: 2 },
  }),

  qty: createSchema({
    id: "qty",
    label: "Qty",
    type: "number",
    semanticType: "number",
    source: SchemaSource.SYSTEM,
    editable: true,
    display: { format: "NUMBER" },
  }),

  targetAndSl: createSchema({
    id: "targetAndSl",
    label: "Traget/SL",
    type: SchemaType.NUMBER,
    semanticType: SemanticType.NUMBER,
    source: SchemaSource.COMPUTED,
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
    type: SchemaType.NUMBER,
    semanticType: SemanticType.NUMBER,
    source: SchemaSource.COMPUTED,
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
    type: SchemaType.NUMBER,
    semanticType: SemanticType.NUMBER,
    source: SchemaSource.COMPUTED,
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
    type: SchemaType.SELECT,
    semanticType: SemanticType.STRING,
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
