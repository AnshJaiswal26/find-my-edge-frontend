const text = [
  "textContains",
  "textContains",
  "textDoesNotContain",
  "textStartsWith",
  "textEndsWith",
  "textIsExactly",
];

const number = [
  "greaterThan",
  "greaterThanEqualTo",
  "lessThan",
  "lessThanEqualTo",
  "isEqualTo",
  "isNotEqualTo",
  "isBetween",
  "isNotBetween",
];

export const filterByType = {
  text: text,
  select: text,
  number: number,
  "number computed": number,
  "time computed": ["dateIs", "dateBefore", "dateAfter"],
  "date computed": ["dateIs", "dateBefore", "dateAfter"],
  date: ["dateIs", "dateBefore", "dateAfter"],
  time: ["dateIs", "dateBefore", "dateAfter"],
};

export const filterOperationMap = {
  // General
  none: () => true,
  // isEmpty: (v) => v === "" || v === null || v === undefined,
  // isNotEmpty: (v) => v !== "" && v !== null && v !== undefined,

  // Text filters
  textContains: (v, t) =>
    String(v).toLowerCase().includes(String(t).toLowerCase()),
  textDoesNotContain: (v, t) =>
    !String(v).toLowerCase().includes(String(t).toLowerCase()),
  textStartsWith: (v, t) =>
    String(v).toLowerCase().startsWith(String(t).toLowerCase()),
  textEndsWith: (v, t) =>
    String(v).toLowerCase().endsWith(String(t).toLowerCase()),
  textIsExactly: (v, t) => String(v).toLowerCase() === String(t).toLowerCase(),

  // Date filters
  dateIs: (v, t) => new Date(v).toDateString() === new Date(t).toDateString(),
  dateBefore: (v, t) => new Date(v) < new Date(t),
  dateAfter: (v, t) => new Date(v) > new Date(t),

  // Number filters
  greaterThan: (v, t) => Number(v) > Number(t),
  greaterThanEqualTo: (v, t) => Number(v) >= Number(t),
  lessThan: (v, t) => Number(v) < Number(t),
  lessThanEqualTo: (v, t) => Number(v) <= Number(t),
  isEqualTo: (v, t) => Number(v) === Number(t),
  isNotEqualTo: (v, t) => Number(v) !== Number(t),
  isBetween: (v, t1, t2) => Number(v) >= Number(t1) && Number(v) <= Number(t2),
  isNotBetween: (v, t1, t2) => Number(v) < Number(t1) || Number(v) > Number(t2),
};

export const filterOptions = {
  // General
  none: "None",
  // isEmpty: "Is empty",
  // isNotEmpty: "Is not empty",

  // Text filters
  textContains: "Text contains",
  textDoesNotContain: "Text does not contain",
  textStartsWith: "Text starts with",
  textEndsWith: "Text ends with",
  textIsExactly: "Text is exactly",

  // Date filters
  dateIs: "Date is",
  dateBefore: "Date is before",
  dateAfter: "Date is after",

  // Number filters
  greaterThan: "Greater than (>)",
  greaterThanEqualTo: "Greater than or equal to (≥)",
  lessThan: "Less than (<)",
  lessThanEqualTo: "Less than or equal to (≤)",
  isEqualTo: "Is equal to (=)",
  isNotEqualTo: "Is not equal to (≠)",
  isBetween: "Is between",
  isNotBetween: "Is not between",
};
