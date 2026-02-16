/* ------------------ SOURCE ------------------ */
const SCHEMA_SOURCE = {
  SYSTEM: "system",
  USER: "user",
  COMPUTED: "computed",
};

/* ------------------ SEMANTIC TYPES ------------------ */
const SEMANTIC_TYPES = {
  NUMBER: "number",
  DURATION: "duration",

  DATE: "date",
  TIME: "time",
  DATETIME: "datetime",

  STRING: "string",
  BOOLEAN: "boolean",

  ANY: "any",
};

/* ------------------ SCHEMA TYPES ------------------ */
const SCHEMA_TYPES = [
  // 🔢 Numeric
  "number",
  "number computed",

  // ⏳ Duration (🔥 FIXED — separate from time)
  "duration",
  "duration computed",

  // 📅 Temporal
  "date",
  "date computed",

  "time",
  "time computed",

  "datetime",
  "datetime computed",

  // 📝 Categorical
  "text",
  "select",

  // ✅ Logical
  "boolean",
];

/* ------------------ LABELS (UI PURPOSE) ------------------ */
const BASE_TYPES = [
  "number",
  "duration",
  "date",
  "time",
  "datetime",
  "text",
  "select",
  // "boolean",
];

/* ------------------ TYPE → SEMANTIC ------------------ */
const SCHEMA_TYPES_GROUP = {
  // 🔢 Numeric
  number: SEMANTIC_TYPES.NUMBER,
  "number computed": SEMANTIC_TYPES.NUMBER,

  // ⏳ Duration
  duration: SEMANTIC_TYPES.DURATION,
  "duration computed": SEMANTIC_TYPES.DURATION,

  // 📅 Temporal
  date: SEMANTIC_TYPES.DATE,
  "date computed": SEMANTIC_TYPES.DATE,

  time: SEMANTIC_TYPES.TIME,
  "time computed": SEMANTIC_TYPES.TIME,

  datetime: SEMANTIC_TYPES.DATETIME,
  "datetime computed": SEMANTIC_TYPES.DATETIME,

  // 📝 Categorical
  text: SEMANTIC_TYPES.STRING,
  select: SEMANTIC_TYPES.STRING,

  // ✅ Logical
  boolean: SEMANTIC_TYPES.BOOLEAN,
};

export {
  SCHEMA_SOURCE,
  SEMANTIC_TYPES,
  SCHEMA_TYPES,
  BASE_TYPES,
  SCHEMA_TYPES_GROUP,
};
