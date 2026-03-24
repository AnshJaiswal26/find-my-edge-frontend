/* ------------------ SOURCE ------------------ */
const SCHEMA_SOURCE = {
  SYSTEM: "system",
  USER: "user",
  COMPUTED: "computed",
};

const SCHEMA_ROLE = {
  SYSTEM_REQUIRED: "system_required",
  USER_DEFINED: "user_defined",
  SYSTEM_OPTIONAL: "system_optional",

  isSystemRequired(value) {
    return value === this.SYSTEM_REQUIRED || value === this.SYSTEM_OPTIONAL;
  },
};

const SCHEMA_COMPUTE_MODE = {
  ROW: "row",
  CUMULATIVE: "cumulative",
};

/* ------------------ SEMANTIC TYPES ------------------ */
const SEMANTIC_TYPE = {
  NUMBER: "number",
  DURATION: "duration",

  DATE: "date",
  TIME: "time",
  DATETIME: "datetime",

  STRING: "string",
  BOOLEAN: "boolean",
};

const SEMANTIC_TYPE_VALUES = Object.values(SEMANTIC_TYPE);

/* ------------------ SCHEMA TYPES ------------------ */
const SCHEMA_TYPE = {
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
const SCHEMA_TYPE_GROUP = {
  // 🔢 Numeric
  number: SEMANTIC_TYPE.NUMBER,

  // ⏳ Duration
  duration: SEMANTIC_TYPE.DURATION,

  // 📅 Temporal
  date: SEMANTIC_TYPE.DATE,

  time: SEMANTIC_TYPE.TIME,

  datetime: SEMANTIC_TYPE.DATETIME,

  // 📝 Categorical
  text: SEMANTIC_TYPE.STRING,
  select: SEMANTIC_TYPE.STRING,

  // ✅ Logical
  boolean: SEMANTIC_TYPE.BOOLEAN,
};

export {
  SCHEMA_SOURCE,
  SCHEMA_ROLE,
  SEMANTIC_TYPE,
  SEMANTIC_TYPE_VALUES,
  SCHEMA_TYPE,
  SCHEMA_COMPUTE_MODE,
  BASE_TYPES,
  SCHEMA_TYPE_GROUP,
};
