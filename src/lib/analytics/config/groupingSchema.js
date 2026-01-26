import { FILTER_TYPE } from "@utils";

export const GROUPING_OPTIONS = {
  value: "Value",
  bucket: "Bucket",
  condition: "Condition",
  range: "Range",
  day: "Day",
  month: "Month",
  year: "Year",
  hour: "Hour",
};

export const GROUPING_SCHEMA = {
  number: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["range"],
    input: "number",
    operators: FILTER_TYPE.number,
  },

  "number computed": {
    kinds: ["value", "bucket", "condition"],
    buckets: ["range"],
    input: "number",
    operators: FILTER_TYPE.number,
  },

  text: {
    kinds: ["value", "condition"],
    input: "text",
    operators: FILTER_TYPE.text,
  },

  select: {
    kinds: ["value", "condition"],
    input: "select",
    operators: FILTER_TYPE.select,
  },

  date: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["day", "month", "year"],
    input: "date",
    operators: FILTER_TYPE.date,
  },

  "date computed": {
    kinds: ["value", "bucket", "condition"],
    buckets: ["day", "month", "year"],
    input: "date",
    operators: FILTER_TYPE.date,
  },

  time: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["hour", "range"],
    input: "time",
    operators: FILTER_TYPE.time,
  },

  "time computed": {
    kinds: ["value", "bucket", "condition"],
    buckets: ["hour", "range"],
    input: "time computed",
    operators: FILTER_TYPE["time computed"],
  },
};
