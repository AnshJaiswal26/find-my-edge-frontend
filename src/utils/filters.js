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

export const FILTER_TYPE = {
  text: TEXT_OPS,
  select: TEXT_OPS,

  number: NUMBER_OPS,
  "number computed": NUMBER_OPS,

  date: DATE_OPS,
  "date computed": DATE_OPS,

  time: TIME_OPS,

  "time computed": DURATION_OPS,
};

const normalizeDate = (d) => new Date(d).setHours(0, 0, 0, 0);

const timeToMinutes = (t) => {
  if (typeof t !== "string") return NaN;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const FILTER_OPERATION_MAP = {
  /* ================= GENERAL ================= */
  none: () => true,

  /* ================= TEXT ================= */
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
  greaterThan: (v, t) => Number(v) > Number(t),
  greaterThanEqualTo: (v, t) => Number(v) >= Number(t),
  lessThan: (v, t) => Number(v) < Number(t),
  lessThanEqualTo: (v, t) => Number(v) <= Number(t),
  isEqualTo: (v, t) => Number(v) === Number(t),
  isNotEqualTo: (v, t) => Number(v) !== Number(t),

  isBetween: (v, t1, t2) => Number(v) >= Number(t1) && Number(v) <= Number(t2),

  isNotBetween: (v, t1, t2) => Number(v) < Number(t1) || Number(v) > Number(t2),

  /* ================= DATE ================= */
  dateIs: (v, t) => normalizeDate(v) === normalizeDate(t),

  dateBefore: (v, t) => normalizeDate(v) < normalizeDate(t),

  dateAfter: (v, t) => normalizeDate(v) > normalizeDate(t),

  dateBetween: (v, t1, t2) => {
    const d = normalizeDate(v);
    return d >= normalizeDate(t1) && d <= normalizeDate(t2);
  },

  dateNotBetween: (v, t1, t2) => {
    const d = normalizeDate(v);
    return d < normalizeDate(t1) || d > normalizeDate(t2);
  },

  /* ================= TIME ================= */
  timeIs: (v, t) => timeToMinutes(v) === timeToMinutes(t),

  timeBefore: (v, t) => timeToMinutes(v) < timeToMinutes(t),

  timeAfter: (v, t) => timeToMinutes(v) > timeToMinutes(t),

  timeBetween: (v, t1, t2) => {
    const tv = timeToMinutes(v);
    return tv >= timeToMinutes(t1) && tv <= timeToMinutes(t2);
  },

  timeNotBetween: (v, t1, t2) => {
    const tv = timeToMinutes(v);
    return tv < timeToMinutes(t1) || tv > timeToMinutes(t2);
  },

  /* ================= DURATION ================= */

  durationIs: (v, t) => Number(v) === Number(t),

  durationGreaterThan: (v, t) => Number(v) > Number(t),

  durationGreaterThanEqualTo: (v, t) => Number(v) >= Number(t),

  durationLessThan: (v, t) => Number(v) < Number(t),

  durationLessThanEqualTo: (v, t) => Number(v) <= Number(t),

  durationBetween: (v, t1, t2) =>
    Number(v) >= Number(t1) && Number(v) <= Number(t2),

  durationNotBetween: (v, t1, t2) =>
    Number(v) < Number(t1) || Number(v) > Number(t2),
};

export const FILTER_OPTIONS = {
  /* TEXT */
  textContains: "Text contains",
  textDoesNotContain: "Text does not contain",
  textStartsWith: "Text starts with",
  textEndsWith: "Text ends with",
  textIsExactly: "Text is exactly",

  /* NUMBER */
  greaterThan: "Greater than (>)",
  greaterThanEqualTo: "Greater than or equal to (≥)",
  lessThan: "Less than (<)",
  lessThanEqualTo: "Less than or equal to (≤)",
  isEqualTo: "Is equal to (=)",
  isNotEqualTo: "Is not equal to (≠)",
  isBetween: "Is between",
  isNotBetween: "Is not between",

  /* DATE */
  dateIs: "Date is",
  dateBefore: "Date is before",
  dateAfter: "Date is after",
  dateBetween: "Date is between",
  dateNotBetween: "Date is not between",

  /* TIME */
  timeIs: "Time is",
  timeBefore: "Time is before",
  timeAfter: "Time is after",
  timeBetween: "Time is between",
  timeNotBetween: "Time is not between",

  /* ================= DURATION ================= */

  durationIs: "Duration is",
  durationGreaterThan: "Duration greater than",
  durationGreaterThanEqualTo: "Duration ≥",
  durationLessThan: "Duration less than",
  durationLessThanEqualTo: "Duration ≤",
  durationBetween: "Duration is between",
  durationNotBetween: "Duration is not between",
};
