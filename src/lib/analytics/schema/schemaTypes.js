/* ------------------ SOURCE ------------------ */
const SCHEMA_SOURCE = {
  SYSTEM: "system",
  USER: "user",
  COMPUTED: "computed",
};

const SCHEMA_COMPUTE_MODE = {
  ROW: "row",
  CUMULATIVE: "cumulative",
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
const SCHEMA_TYPES = {
  NUMBER: "number",
  DURATION: "duration",

  DATE: "date",
  TIME: "time",
  DATETIME: "datetime",

  TEXT: "text",
  SELECT: "select",

  BOOLEAN: "boolean",
};

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

  // ⏳ Duration
  duration: SEMANTIC_TYPES.DURATION,

  // 📅 Temporal
  date: SEMANTIC_TYPES.DATE,

  time: SEMANTIC_TYPES.TIME,

  datetime: SEMANTIC_TYPES.DATETIME,

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
  SCHEMA_COMPUTE_MODE,
  BASE_TYPES,
  SCHEMA_TYPES_GROUP,
};
