import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FormulaSuggestions } from "./FormulaSuggestions";
import { FormulaValidation } from "./FormulaValidation";
import { buildAST, tokenize, toPostfix, validateTypes } from "@lib/expression";
import { Section } from "@layout";
import { formatExpression } from "./formatExpression";
import { getSchemaSuggestions, getFunctionSuggestions } from "./suggestions";
import { highlightFormula } from "./highlightFormula";
import { FunctionDocsPanel } from "./FunctionDocPanel";

function labelsToIds(expr, usedSchemas) {
  let result = expr;
  for (const sch of usedSchemas) {
    const safeLabel = sch.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${safeLabel}\\b`, "g");
    result = result.replace(regex, `@{${sch.id}}`);
  }
  return result;
}

export const ExpressionBuilder = forwardRef(function ExpressionBuilder(
  { value = "", schemas, onCommit, onChange, mode = "BASE" },
  ref,
) {
  const [labelExpr, setLabelExpr] = useState(value);
  const [cursor, setCursor] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(true);
  const [usedSchemas, setUsedSchemas] = useState([]);
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (labelExpr === "") {
      setError("Empty expression");
    }
  }, []);

  // ---------- ID EXPRESSION ----------
  const idExpr = useMemo(
    () => labelsToIds(labelExpr, usedSchemas),
    [labelExpr, usedSchemas],
  );

  const highlighted = useMemo(() => highlightFormula(labelExpr), [labelExpr]);

  // ---------- PARSE ----------
  const { ast, dependencies } = useMemo(() => {
    if (!idExpr.trim())
      return { ast: null, dependencies: null, error: "Empty expression" };

    try {
      const result = buildAST(toPostfix(tokenize(idExpr)), mode);

      if (result?.ast) {
        validateTypes(result.ast, mode);
      }

      if (error) {
        setError(null);
      }

      return { ...result, error: null };
    } catch (err) {
      setError(err.message);
      return { ast: null, dependencies: null, error: err.message };
    }
  }, [idExpr, mode]);

  const validSchemaIds = useMemo(
    () => new Set(schemas?.map((s) => String(s.id))),
    [schemas],
  );

  const semanticError = useMemo(() => {
    if (!dependencies) {
      return null;
    }
    for (const dep of dependencies) {
      if (!validSchemaIds.has(String(dep))) {
        setError(`Unknown reference '${dep}'`);
        return true;
      }
    }
    return null;
  }, [dependencies, validSchemaIds]);

  // ---------- SUGGESTIONS ----------
  const suggestions = useMemo(() => {
    const m = labelExpr.slice(0, cursor).match(/[a-zA-Z_]+$/);
    if (!m) return [];
    const q = m[0].toLowerCase();
    return [
      ...getFunctionSuggestions(q, mode),
      ...getSchemaSuggestions(q, schemas),
    ];
  }, [labelExpr, cursor, schemas, mode]);

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
        insert = `${item.name}()`;
      }

      const before = labelExpr.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");
      const after = labelExpr.slice(cursor);
      const next = `${before}${insert}${after}`;
      setLabelExpr(next);

      const newCursor = before.length + insert.length;
      setCursor(newCursor);
      setOpen(false);

      // Focus and set cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 0);
    },
    [labelExpr, cursor],
  );

  // ---------- SYNC SCROLL ----------
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // ---------- KEYBOARD NAV ----------
  const onKeyDown = useCallback(
    (e) => {
      if (!suggestions.length || !open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => (h + 1) % suggestions.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySuggestion(suggestions[highlight]);
        setHighlight(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [suggestions, highlight, applySuggestion, open],
  );

  // ---------- DETECT SCHEMAS ----------
  useEffect(() => {
    if (!schemas?.length || !labelExpr) return;
    const detected = schemas.filter((s) =>
      new RegExp(
        `\\b${s.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      ).test(labelExpr),
    );
    setUsedSchemas(detected.map((s) => ({ id: s.id, label: s.label })));
  }, [schemas, labelExpr]);

  // ---------- HANDLE TYPING ----------
  const handleChange = useCallback(
    (e) => {
      setLabelExpr(e.target.value);
      setCursor(e.target.selectionStart);
      setOpen(true);
      onChange?.(labelExpr, ast, dependencies, error);
    },
    [labelExpr, ast, dependencies, error],
  );

  const handleBlur = useCallback(() => {
    const formatted = formatExpression(labelExpr);
    setLabelExpr(formatted);
    onCommit?.(formatted, ast, dependencies, error);
    if (labelExpr === "") setError("Expression is required");
    setOpen(false);
  }, [labelExpr, ast, dependencies, error]);

  const handleFocus = () => {
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    validateNow: () => error,
    getAST: () => ast,
    getDependencies: () => dependencies,
    getExpression: () => labelExpr,
  }));

  const sharedTextLayer =
    "m-0 p-3 border-0 box-border w-full min-h-[52px] " +
    "font-mono text-[16px] leading-[1.6] tracking-[0] font-normal " +
    "whitespace-pre-wrap break-words [tab-size:4] " +
    "[font-variant-ligatures:none] [font-feature-settings:'liga'_0] " +
    "[font-kerning:none]";

  return (
    <Section title="Expression Query">
      <div className="relative w-full">
        <div
          className="
            relative w-full min-h-[52px]
            bg-(--surface-disabled) rounded-lg overflow-hidden
            border-2 border-(--border) transition-colors
            focus-within:border-(--info)
            grid
          "
        >
          {/* Highlight layer */}
          <div
            ref={highlightRef}
            className={`
              ${sharedTextLayer}
              absolute inset-0
              text-(--text) bg-transparent
              pointer-events-none select-none
              overflow-hidden 
              ${!!ast && !semanticError ? "" : "!text-red-500"}
            `}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />

          {/* Input layer */}
          <textarea
            ref={textareaRef}
            value={labelExpr}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onScroll={handleScroll}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="Enter formula..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={`
            ${sharedTextLayer}
            relative z-10
            bg-transparent
            text-transparent caret-(--text)
            outline-none resize-vertical
            min-h-[50px] max-h-[300px]
            overflow-auto
            placeholder:text-(--text-muted)
            focus:placeholder:opacity-50
          `}
          />
        </div>

        {open && suggestions.length > 0 && (
          <FormulaSuggestions
            suggestions={suggestions}
            highlight={highlight}
            onSelect={applySuggestion}
          />
        )}

        {labelExpr !== null && (
          <FormulaValidation valid={!!ast && !semanticError} error={error} />
        )}
      </div>
      <FunctionDocsPanel />
      <FunctionDocsPanel mode={mode} />
    </Section>
  );
});
