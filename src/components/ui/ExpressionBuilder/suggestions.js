import { highlightMatch } from "./highlightMatch";
import { CONDITION_FUNCTIONS } from "@lib/analytics/engine/functions/condition/registry";

export function getSchemaSuggestions(q, schemas, showAll = false) {
  const filtered = showAll
    ? schemas
    : schemas.filter((c) => c.label.toLowerCase().includes(q));

  return filtered.map((c) => ({
    type: "schema",
    label: c.label,
    id: c.id,
    highlight: highlightMatch(c.label, q),
  }));
}

export function getFunctionSuggestions(q, functions, showAll = false) {
  const entries = Object.entries({ ...functions, ...CONDITION_FUNCTIONS });

  const filtered = showAll
    ? entries
    : entries.filter(([name]) => name.toLowerCase().includes(q));

  return filtered.map(([name, value]) => ({
    type: "function",
    name,
    icon: value.icon,
    signature: value.signature,
    highlight: highlightMatch(value.signature, q),
  }));
}
