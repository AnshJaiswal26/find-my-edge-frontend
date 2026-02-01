import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Input } from "@ui";
import { FormulaSuggestions } from "./FormulaSuggestions";
import { FormulaValidation } from "./FormulaValidation";
import { buildAST, tokenize, toPostfix } from "@lib/expression";
import { Section } from "@layout";
import { formatExpression } from "./formatExpression";
import { getSchemaSuggestions, getFunctionSuggestions } from "./suggestions";

function labelsToIds(expr, usedSchemas) {
  let result = expr;
  for (const sch of usedSchemas) {
    const safeLabel = sch.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${safeLabel}\\b`, "g");
    result = result.replace(regex, `@{${sch.id}}`);
  }
  return result;
}

export default function ExpressionBuilder({
  value = "",
  schemas,
  functions,
  onCommit,
  onChange,
}) {
  const [labelExpr, setLabelExpr] = useState(value);
  const [cursor, setCursor] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(true);
  const [usedSchemas, setUsedSchemas] = useState([]);

  const [error, setError] = useState(null);

  const functionsArity = useMemo(() => {
    return Object.fromEntries(
      Object.entries(functions).map(([name, def]) => [name, def.arity]),
    );
  }, [functions]);

  // ---------- ID EXPRESSION ----------
  const idExpr = useMemo(
    () => labelsToIds(labelExpr, usedSchemas),
    [labelExpr, usedSchemas],
  );

  // ---------- PARSE ----------
  const parseResult = useMemo(() => {
    if (!idExpr.trim()) return null;
    try {
      const result = buildAST(toPostfix(tokenize(idExpr)), functionsArity);

      return result;
    } catch (error) {
      setError(error.message);
      return null;
    }
  }, [idExpr]);

  const ast = parseResult?.ast ?? null;
  const dependency = parseResult?.dependency ?? null;

  const validSchemaIds = useMemo(
    () => new Set(schemas?.map((s) => String(s.id))),
    [schemas],
  );

  const semanticError = useMemo(() => {
    if (!dependency) {
      if (error) setError(null);
      return null;
    }

    for (const dep of dependency) {
      // dep.isId means it came from @{id}
      if (!validSchemaIds.has(String(dep))) {
        setError(`Unknown reference '${dep}'`);
        return true;
      }
    }

    return null;
  }, [dependency, validSchemaIds]);

  // console.log(ast, dependency, idExpr);

  // ---------- SUGGESTIONS ----------
  const suggestions = useMemo(() => {
    const m = labelExpr.slice(0, cursor).match(/[a-zA-Z_]+$/);
    if (!m) return [];

    const q = m[0].toLowerCase();
    return [
      ...getFunctionSuggestions(q, functions),
      ...getSchemaSuggestions(q, schemas),
    ];
  }, [labelExpr, cursor, schemas]);

  // ---------- APPLY SUGGESTION ----------
  const applySuggestion = useCallback(
    (item) => {
      let insert = "";

      if (item.type === "schema") {
        insert = item.label;

        setUsedSchemas((prev) =>
          prev.some((c) => c.id === item.id)
            ? prev
            : [...prev, { id: item.id, label: item.label }],
        );
      }

      if (item.type === "function") {
        insert = `${item.name}(`;
      }

      const before = labelExpr.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");
      const after = labelExpr.slice(cursor);

      const next = `${before}${insert}${after}`;
      setLabelExpr(next);
      setCursor(before.length + insert.length);
      setOpen(false);
    },
    [labelExpr, cursor],
  );

  // ---------- HANDLE TYPING ----------
  const handleChange = useCallback((e) => {
    setLabelExpr(e.target.value);

    setCursor(e.target.selectionStart);
    setOpen(true);
  }, []);

  // ---------- KEYBOARD NAV ----------
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

  // run when schemas load
  useEffect(() => {
    if (!schemas?.length || !labelExpr) return;

    const detected = schemas.filter((s) =>
      new RegExp(
        `\\b${s.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      ).test(labelExpr),
    );

    setUsedSchemas(detected.map((s) => ({ id: s.id, label: s.label })));
  }, [schemas]);

  // ---------- CHANGE + COMMIT ----------
  useEffect(() => {
    onChange?.(labelExpr, ast, dependency);
  }, [labelExpr, ast, dependency, onChange]);

  const handleBlur = () => {
    const formatted = formatExpression(labelExpr);
    setLabelExpr(formatted);
    onCommit?.(formatted, ast, dependency);
    setOpen(false);
  };

  return (
    <Section title="Formula">
      <Input
        classNames={{ input: "max-w-full!" }}
        vertical
        value={labelExpr}
        placeholder="eg. (Exit - Entry) * Qty"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
      />

      {open && (
        <FormulaSuggestions
          suggestions={suggestions}
          highlight={highlight}
          onSelect={applySuggestion}
        />
      )}

      {labelExpr && (
        <FormulaValidation valid={!!ast && !semanticError} error={error} />
      )}
    </Section>
  );
}
