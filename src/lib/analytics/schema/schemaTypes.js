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

export { SCHEMA_SOURCE, VALUE_TYPE, COMPUTE_TYPE };
