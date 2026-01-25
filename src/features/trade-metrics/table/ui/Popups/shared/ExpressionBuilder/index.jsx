import React, { useCallback, useMemo, useState } from "react";
import { Input } from "@ui";
import { FormulaSuggestions } from "./FormulaSuggestions";
import { FormulaValidation } from "./FormulaValidation";
import { useNumericColumns } from "@table/hooks";
import { buildAST, tokenize, toPostfix } from "@lib/expression";

import { Section } from "@layout";
import { formatExpression } from "./formatExpression";
import { getColumnSuggestions, getFunctionSuggestions } from "./suggestions";

export function ExpressionBuilder({ value, mode, onCommit, onChange }) {
  const { numericColumns, labelToId } = useNumericColumns();

  const [cursor, setCursor] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(true);
  const [expr, setExpr] = useState(value);

  const suggestions = useMemo(() => {
    const m = expr.slice(0, cursor).match(/[a-zA-Z_]+$/);
    if (!m) return [];

    const q = m[0].toLowerCase();
    return [
      ...getFunctionSuggestions(q, mode),
      ...getColumnSuggestions(q, numericColumns),
    ];
  }, [expr, cursor, numericColumns, mode]);

  const parseResult = useMemo(() => {
    if (!expr.trim()) return null;
    try {
      return buildAST(toPostfix(tokenize(expr)), labelToId);
    } catch {
      return null;
    }
  }, [expr, labelToId]);

  const ast = parseResult?.ast ?? null;
  const dependency = parseResult?.dependency ?? null;

  const applySuggestion = useCallback(
    (item) => {
      let insert = "";

      console.log(item);

      if (item.type === "column") {
        insert = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(item.label)
          ? item.label
          : `[${item.label}]`;
      }

      if (item.type === "function") {
        insert = `${item.name}(`;
      }

      const before = expr.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");
      const after = expr.slice(cursor);

      setExpr(`${before}${insert}${after}`);
      setCursor(before.length + insert.length);
      setOpen(false);
    },
    [expr, cursor],
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
        applySuggestion(suggestions[highlight]);
        setHighlight(0);
      }
    },
    [suggestions, highlight, applySuggestion],
  );

  const handleChange = useCallback(
    (e) => {
      const exp = e.target.value;
      setExpr(exp);
      setCursor(e.target.selectionStart);
      setOpen(true);
      onChange?.(exp, ast, dependency);
    },
    [ast, dependency, onChange],
  );

  const handleBlur = useCallback(() => {
    const formatted = formatExpression(expr);
    setExpr(formatted);
    onCommit?.(formatted, ast, dependency);
    setOpen(false);
  }, [expr, ast, dependency]);

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
