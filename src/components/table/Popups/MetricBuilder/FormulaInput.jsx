import React, { useCallback, useMemo, useState } from "react";
import { Input } from "@ui";
import { FormulaSuggestions } from "./FormulaSuggestions";

export function FormulaInput({ value, onChange, ast, numericColumns }) {
  const [cursor, setCursor] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(true);

  const suggestions = useMemo(() => {
    const m = value.slice(0, cursor).match(/[a-zA-Z_]+$/);
    if (!m) return [];
    const q = m[0].toLowerCase();
    return numericColumns.filter((c) => c.label.toLowerCase().startsWith(q));
  }, [value, cursor, numericColumns]);

  const applySuggestion = useCallback(
    (label) => {
      const before = value.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");
      const after = value.slice(cursor);
      onChange(`${before}${label}${after}`);
      setOpen(false);
    },
    [value, cursor, onChange]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (!suggestions.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => (h + 1) % suggestions.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        applySuggestion(suggestions[highlight].label);
        setHighlight(0);
      }
    },
    [suggestions, highlight, applySuggestion]
  );

  return (
    <div className="relative">
      <Input
        vertical
        label="Formula"
        value={value}
        placeholder="eg. (Exit - Entry) * Qty"
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          onChange(e.target.value);
          setCursor(e.target.selectionStart);
          setOpen(true);
        }}
      />

      {open && (
        <FormulaSuggestions
          suggestions={suggestions}
          highlight={highlight}
          onSelect={applySuggestion}
        />
      )}
    </div>
  );
}
