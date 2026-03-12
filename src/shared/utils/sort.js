const TEXT_SORTS = ["sortAToZ", "sortZToA"];
const NUMBER_SORTS = ["sortLowToHigh", "sortHighToLow"];
const DATE_SORTS = ["sortOldestFirst", "sortNewestFirst"];
const TIME_SORTS = ["sortEarliestFirst", "sortLatestFirst"];
const DURATION_SORTS = ["sortShortestFirst", "sortLongestFirst"];

const SORT_TYPE = {
  string: TEXT_SORTS,
  number: NUMBER_SORTS,
  // boolean: BOOLEAN_SORTS,

  date: DATE_SORTS,
  time: TIME_SORTS,
  datetime: DATE_SORTS,

  duration: DURATION_SORTS,
};

// Sort operations
const SORT_OPERATION_MAP = {
  /* TEXT */
  sortAToZ: (a, b) => String(a).localeCompare(String(b)),
  sortZToA: (a, b) => String(b).localeCompare(String(a)),

  /* NUMBER */
  sortLowToHigh: (a, b) => a - b,
  sortHighToLow: (a, b) => b - a,

  /* DATE (timestamps) */
  sortOldestFirst: (a, b) => a - b,
  sortNewestFirst: (a, b) => b - a,

  /* TIME (minutes/seconds since midnight) */
  sortEarliestFirst: (a, b) => a - b,
  sortLatestFirst: (a, b) => b - a,

  /* DURATION (seconds/minutes) */
  sortShortestFirst: (a, b) => a - b,
  sortLongestFirst: (a, b) => b - a,
};

const SORT_OPTIONS = {
  none: "None",

  /* TEXT */
  sortAToZ: "A → Z",
  sortZToA: "Z → A",

  /* NUMBER */
  sortLowToHigh: "Low → High",
  sortHighToLow: "High → Low",

  /* DATE */
  sortOldestFirst: "Oldest → Newest",
  sortNewestFirst: "Newest → Oldest",

  /* TIME */
  sortEarliestFirst: "Earliest → Latest",
  sortLatestFirst: "Latest → Earliest",

  /* DURATION */
  sortShortestFirst: "Shortest → Longest",
  sortLongestFirst: "Longest → Shortest",
};

const applySort = (data, sort, getValue) => {
  if (!sort?.key || sort.operator === "none") return data;

  const fn = SORT_OPERATION_MAP[sort.operator];
  if (!fn) return data;

  const result = [...data];

  result.sort((a, b) => {
    const v1 = getValue(a, sort.key);
    const v2 = getValue(b, sort.key);
    return fn(v1, v2);
  });

  return result;
};

export { SORT_TYPE, SORT_OPERATION_MAP, SORT_OPTIONS, applySort };
