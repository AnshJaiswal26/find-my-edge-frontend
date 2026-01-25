import { highlightMatch } from "./highlightMatch";
import { BASE_FUNCTIONS } from "@lib/analytics/engine/functions/base/registry";
import { CONDITION_FUNCTIONS } from "@lib/analytics/engine/functions/condition/registry";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";

export function getColumnSuggestions(q, numericColumns) {
  return numericColumns
    .filter((c) => c.label.toLowerCase().includes(q))
    .map((c) => ({
      type: "column",
      label: c.label,
      colId: c.id,
      highlight: highlightMatch(c.label, q),
    }));
}

export function getFunctionSuggestions(q, mode) {
  const functions = mode === "row" ? BASE_FUNCTIONS : WINDOW_FUNCTIONS;

  return Object.entries({ ...functions, ...CONDITION_FUNCTIONS })
    .filter(([name]) => name.toLowerCase().includes(q))
    .map(([name, value]) => ({
      type: "function",
      name,
      icon: value.icon,
      signature: value.signature,
      highlight: highlightMatch(value.signature, q),
    }));
}
