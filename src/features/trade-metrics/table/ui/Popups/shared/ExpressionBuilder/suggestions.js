import { FUNCTION_REGISTRY } from "@table/engine/functions/registry";
import { highlightMatch } from "./highlightMatch";

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

export function getFunctionSuggestions(q) {
  return Object.entries(FUNCTION_REGISTRY)
    .filter(([name]) => name.toLowerCase().includes(q))
    .map(([name, value]) => ({
      type: "function",
      name,
      icon: value.icon,
      signature: value.signature,
      highlight: highlightMatch(value.signature, q),
    }));
}
