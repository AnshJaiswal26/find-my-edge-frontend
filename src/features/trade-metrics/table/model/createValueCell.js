const DEFAULT_VALUE_MAP = {
  number: () => 0,
  duration: () => 0,
  time: () => 0,

  date: () => new Date().toISOString().slice(0, 10),
  datetime: () => new Date().toISOString(),

  text: () => "—",

  select: (column) => column?.options?.[0] ?? "—",

  boolean: () => 0,
};

export function createCellValue(column) {
  const resolver = DEFAULT_VALUE_MAP[column.type];

  return resolver ? resolver(column) : null;
}
