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

  string: {
    kinds: ["value", "condition"],
    input: "text",
    operators: FILTER_TYPE.string,
  },

  boolean: {
    kinds: ["value", "condition"],
    input: "boolean",
    operators: FILTER_TYPE.boolean,
  },

  date: {
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

  datetime: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["day", "month", "year", "hour"],
    input: "datetime",
    operators: FILTER_TYPE.datetime,
  },

  duration: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["range"],
    input: "duration",
    operators: FILTER_TYPE.duration,
  },
};
