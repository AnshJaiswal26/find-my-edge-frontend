import { SemanticType } from "@lib/analytics/schema";
import { parseInputValue } from "@shared/utils";

const DEFAULT_VALUE_MAP = {
  number: () => 0,
  duration: () => 0,
  time: () => 0,

  date: () =>
    parseInputValue(new Date().toISOString().slice(0, 10), SemanticType.DATE),
  datetime: () =>
    parseInputValue(new Date().toISOString(), SemanticType.DATETIME),

  text: () => "—",

  select: (column) => column?.options?.[0] ?? "—",

  boolean: () => 0,
};

export function createCellValue(column) {
  const resolver = DEFAULT_VALUE_MAP[column.type];

  return resolver ? resolver(column) : null;
}
