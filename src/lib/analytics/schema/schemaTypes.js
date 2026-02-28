/* ------------------ SOURCE ------------------ */
const SchemaSource = {
  SYSTEM: "system",
  USER: "user",
  COMPUTED: "computed",
};

const SchemaComputeMode = {
  ROW: "row",
  CUMULATIVE: "cumulative",
};

/* ------------------ SEMANTIC TYPES ------------------ */
const SemanticType = {
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
const SchemaType = {
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
const SchemaTypeGroup = {
  // 🔢 Numeric
  number: SemanticType.NUMBER,

  // ⏳ Duration
  duration: SemanticType.DURATION,

  // 📅 Temporal
  date: SemanticType.DATE,

  time: SemanticType.TIME,

  datetime: SemanticType.DATETIME,

  // 📝 Categorical
  text: SemanticType.STRING,
  select: SemanticType.STRING,

  // ✅ Logical
  boolean: SemanticType.BOOLEAN,
};

export {
  SchemaSource,
  SemanticType,
  SchemaType,
  SchemaComputeMode,
  BASE_TYPES,
  SchemaTypeGroup,
};
