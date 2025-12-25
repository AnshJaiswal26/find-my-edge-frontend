export const filterByType = {
  text: [
    "textContains",
    "textContains",
    "textDoesNotContain",
    "textStartsWith",
    "textEndsWith",
    "textIsExactly",
  ],
  select: [
    "textContains",
    "textContains",
    "textDoesNotContain",
    "textStartsWith",
    "textEndsWith",
    "textIsExactly",
  ],
  number: [
    "greaterThan",
    "greaterThanEqualTo",
    "lessThan",
    "lessThanEqualTo",
    "isEqualTo",
    "isNotEqualTo",
    "isBetween",
    "isNotBetween",
  ],
  computed: [
    "greaterThan",
    "greaterThanEqualTo",
    "lessThan",
    "lessThanEqualTo",
    "isEqualTo",
    "isNotEqualTo",
    "isBetween",
    "isNotBetween",
  ],
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

// Sort operations
export const sortOperationMap = {
  sortAToZ: (a, b) => String(a).localeCompare(String(b)), // alphabetical ascending
  sortZToA: (a, b) => String(b).localeCompare(String(a)), // alphabetical descending
  sortLowToHigh: (a, b) => Number(a) - Number(b), // numeric ascending
  sortHighToLow: (a, b) => Number(b) - Number(a), // numeric descending
  sortOldestFirst: (a, b) => new Date(a) - new Date(b), // date ascending
  sortNewestFirst: (a, b) => new Date(b) - new Date(a), // date descending
};

export const sortOptions = {
  none: "None",
  sortAToZ: "Sort A → Z",
  sortZToA: "Sort Z → A",
  sortLowToHigh: "Sort Low → High",
  sortHighToLow: "Sort High → Low",
  sortOldestFirst: "Sort Oldest → Newest",
  sortNewestFirst: "Sort Newest → Oldest",
};
