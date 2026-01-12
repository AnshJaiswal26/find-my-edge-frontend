export const sortByType = {
  text: ["sortAToZ", "sortZToA"],
  select: ["sortAToZ", "sortZToA"],
  number: ["sortLowToHigh", "sortHighToLow"],
  "number computed": ["sortLowToHigh", "sortHighToLow"],
  "time computed": ["sortOldestFirst", "sortNewestFirst"],
  "date computed": ["sortOldestFirst", "sortNewestFirst"],
  date: ["sortOldestFirst", "sortNewestFirst"],
  time: ["sortOldestFirst", "sortNewestFirst"],
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
