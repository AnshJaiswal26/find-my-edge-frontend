import {
  FUNCTION_REGISTRY,
  FUNCTION_ALLOW_BY_MODE,
} from "@lib/analytics/engine/functions";
import { highlightMatch } from "./highlightMatch";

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

export function getFunctionSuggestions(q, mode, showAll = false) {
  const allowedNames =
    mode === "ALL"
      ? Object.keys(FUNCTION_REGISTRY)
      : Array.from(FUNCTION_ALLOW_BY_MODE[mode] || []);

  const entries = allowedNames.map((name) => [name, FUNCTION_REGISTRY[name]]);

  const filtered = showAll
    ? entries
    : entries.filter(([name]) => name.toLowerCase().includes(q.toLowerCase()));

  return filtered.map(([name, def]) => ({
    type: "function",
    name,
    icon: def.icon,
    signature: def.signature,
    description: def.description,
    highlight: highlightMatch(def.signature, q),
  }));
}
