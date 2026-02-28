import {
  FunctionRegistry,
  FunctionAllowByMode,
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
      ? Object.keys(FunctionRegistry)
      : Array.from(FunctionAllowByMode[mode] || []);

  const entries = allowedNames.map((name) => [name, FunctionRegistry[name]]);

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
