const SCHEMA_SOURCE = {
  SYSTEM: "system",
  USER: "user",
  COMPUTED: "computed",
};

const VALUE_TYPE = {
  NUMBER: "number",
  TEXT: "text",
  DATE: "date",
  TIME: "time",
};

const COMPUTE_TYPE = {
  ROW: "row",
  GLOBAL: "global",
  GROUP: "group",
  WINDOW: "window",
  GROUP_WINDOW: "group-window",
};

const SCHEMA_TYPES = [
  "number computed",
  "time computed",
  // "date computed",
  "number",
  "text",
  "date",
  "time",
  "select",
];

const SCHEMA_TYPES_LABELS = {
  "number computed": "COMPUTED",
  "time computed": "DURATION",
  // "date computed": "DATE COMPUTED",
  number: "NUMBER",
  text: "TEXT",
  date: "DATE",
  time: "TIME",
  select: "SELECT",
};

const SCHEMA_TYPES_GROUP = {
  number: "number",
  "number computed": "number",

  time: "time",

  "time computed": "duration",

  date: "date",

  "date computed": "date",

  text: "text",
  select: "text",
};

export {
  SCHEMA_SOURCE,
  VALUE_TYPE,
  COMPUTE_TYPE,
  SCHEMA_TYPES,
  SCHEMA_TYPES_LABELS,
  SCHEMA_TYPES_GROUP,
};
