const TEXT_OPS = [
  "textContains",
  "textDoesNotContain",
  "textStartsWith",
  "textEndsWith",
  "textIsExactly",
];

const NUMBER_OPS = [
  "greaterThan",
  "greaterThanEqualTo",
  "lessThan",
  "lessThanEqualTo",
  "isEqualTo",
  "isNotEqualTo",
  "isBetween",
  "isNotBetween",
];

const DATE_OPS = [
  "dateIs",
  "dateBefore",
  "dateAfter",
  "dateBetween",
  "dateNotBetween",
];

const TIME_OPS = [
  "timeIs",
  "timeBefore",
  "timeAfter",
  "timeBetween",
  "timeNotBetween",
];

const DURATION_OPS = [
  "durationIs",
  "durationGreaterThan",
  "durationGreaterThanEqualTo",
  "durationLessThan",
  "durationLessThanEqualTo",
  "durationBetween",
  "durationNotBetween",
];

const FILTER_TYPE = {
  text: TEXT_OPS,
  select: TEXT_OPS,

  number: NUMBER_OPS,
  "number computed": NUMBER_OPS,

  date: DATE_OPS,
  "date computed": DATE_OPS,

  time: TIME_OPS,

  "time computed": DURATION_OPS,
};

// =============== Helpers ======================
const isBetween = (op) => op?.includes("Between");

const FILTER_OPERATION_MAP = {
  /* ================= GENERAL ================= */
  none: () => true,

  /* ================= TEXT (still string-based) ================= */
  textContains: (v, t) =>
    String(v).toLowerCase().includes(String(t).toLowerCase()),

  textDoesNotContain: (v, t) =>
    !String(v).toLowerCase().includes(String(t).toLowerCase()),

  textStartsWith: (v, t) =>
    String(v).toLowerCase().startsWith(String(t).toLowerCase()),

  textEndsWith: (v, t) =>
    String(v).toLowerCase().endsWith(String(t).toLowerCase()),

  textIsExactly: (v, t) => String(v).toLowerCase() === String(t).toLowerCase(),

  /* ================= NUMBER ================= */
  greaterThan: (v, t) => v > t,
  greaterThanEqualTo: (v, t) => v >= t,
  lessThan: (v, t) => v < t,
  lessThanEqualTo: (v, t) => v <= t,
  isEqualTo: (v, t) => v === t,
  isNotEqualTo: (v, t) => v !== t,

  isBetween: (v, t1, t2) => v >= t1 && v <= t2,
  isNotBetween: (v, t1, t2) => v < t1 || v > t2,

  /* ================= DATE (timestamp numbers) ================= */
  dateIs: (v, t) => v === t,
  dateBefore: (v, t) => v < t,
  dateAfter: (v, t) => v > t,
  dateBetween: (v, t1, t2) => v >= t1 && v <= t2,
  dateNotBetween: (v, t1, t2) => v < t1 || v > t2,

  /* ================= TIME (minutes/seconds as numbers) ================= */
  timeIs: (v, t) => v === t,
  timeBefore: (v, t) => v < t,
  timeAfter: (v, t) => v > t,
  timeBetween: (v, t1, t2) => v >= t1 && v <= t2,
  timeNotBetween: (v, t1, t2) => v < t1 || v > t2,

  /* ================= DURATION (numbers) ================= */
  durationIs: (v, t) => v === t,
  durationGreaterThan: (v, t) => v > t,
  durationGreaterThanEqualTo: (v, t) => v >= t,
  durationLessThan: (v, t) => v < t,
  durationLessThanEqualTo: (v, t) => v <= t,
  durationBetween: (v, t1, t2) => v >= t1 && v <= t2,
  durationNotBetween: (v, t1, t2) => v < t1 || v > t2,
};

const FILTER_OPTIONS = {
  /* TEXT */
  textContains: "Contains",
  textDoesNotContain: "Does not contain",
  textStartsWith: "Starts with",
  textEndsWith: "Ends with",
  textIsExactly: "Is exactly",

  /* NUMBER (generic numeric fields) */
  greaterThan: "Greater than (>)",
  greaterThanEqualTo: "Greater than or equal to (≥)",
  lessThan: "Less than (<)",
  lessThanEqualTo: "Less than or equal to (≤)",
  isEqualTo: "Equal to (=)",
  isNotEqualTo: "Not equal to (≠)",
  isBetween: "Between",
  isNotBetween: "Not between",

  /* DATE (timestamps but user thinks in dates) */
  dateIs: "On",
  dateBefore: "Before",
  dateAfter: "After",
  dateBetween: "Between dates",
  dateNotBetween: "Not between dates",

  /* TIME (time of day) */
  timeIs: "At time",
  timeBefore: "Before time",
  timeAfter: "After time",
  timeBetween: "Between times",
  timeNotBetween: "Not between times",

  /* ================= DURATION ================= */
  durationIs: "Exactly",
  durationGreaterThan: "Longer than",
  durationGreaterThanEqualTo: "Longer than or equal to",
  durationLessThan: "Shorter than",
  durationLessThanEqualTo: "Shorter than or equal to",
  durationBetween: "Between durations",
  durationNotBetween: "Not between durations",
};

export {
  TEXT_OPS,
  NUMBER_OPS,
  DATE_OPS,
  TIME_OPS,
  DURATION_OPS,
  FILTER_TYPE,
  isBetween,
  FILTER_OPERATION_MAP,
  FILTER_OPTIONS,
};
