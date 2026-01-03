import React, { useCallback, useMemo, useState } from "react";
import { Input } from "@ui";
import { FormulaSuggestions } from "./FormulaSuggestions";
import { FormulaValidation } from "./FormulaValidation";
import { useNumericColumns } from "../../../hooks";
import { buildAST, tokenize, toPostfix } from "../../../../engine/ast";
import { Section } from "@layout";

export function ExpressionBuilder({ value, onCommit, onChange }) {
  const { numericColumns, labelToId } = useNumericColumns();

  const [cursor, setCursor] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(true);
  const [expr, setExpr] = useState(value);

  const suggestions = useMemo(() => {
    const m = expr.slice(0, cursor).match(/[a-zA-Z_]+$/);
    if (!m) return [];
    const q = m[0].toLowerCase();
    return numericColumns.filter((c) => c.label.toLowerCase().startsWith(q));
  }, [expr, cursor, numericColumns]);

  const generatedAst = useMemo(() => {
    try {
      return buildAST(toPostfix(tokenize(expr)), labelToId);
    } catch {
      return null;
    }
  }, [expr, labelToId]);

  const { ast, dependency } = generatedAst
    ? generatedAst
    : { ast: null, dependency: null };

  const applySuggestion = useCallback(
    (label, colId) => {
      const formatted = /[^a-zA-Z0-9_-]/.test(label) ? `[${label}]` : label;

      const before = expr.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");

      const after = expr.slice(cursor);

      setExpr(`${before}${formatted}${after}`);
      setOpen(false);
    },
    [expr, cursor]
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

  const handleChange = useCallback(
    (e) => {
      const exp = e.target.value;
      setExpr(exp);
      onChange?.(exp, ast, dependency);
      setCursor(e.target.selectionStart);
      setOpen(true);
    },
    [expr, setExpr, setCursor, setOpen]
  );

  const handleBlur = useCallback(
    (e) => {
      const parsedExp = expr
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/\s*([+\-*/])\s*/g, " $1 ");

      setExpr(parsedExp);
      onCommit?.(parsedExp, ast, dependency);
      setOpen(false);
    },
    [expr, setExpr, setOpen]
  );

  return (
    <Section title={"Formula"}>
      <Input
        vertical
        value={expr}
        placeholder="eg. (Exit - Entry) * Qty"
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      {open && (
        <FormulaSuggestions
          suggestions={suggestions}
          highlight={highlight}
          onSelect={applySuggestion}
        />
      )}

      {expr !== "" && <FormulaValidation valid={!!ast} />}
    </Section>
  );
}
