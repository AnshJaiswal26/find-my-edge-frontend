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
import {
  buildAST,
  tokenize,
  toPostfix,
  validateTypes,
  validateSemantic,
} from "@lib/expression";
import { Section } from "@shared/components/layout";
import { formatExpression } from "./formatExpression";
import { getSchemaSuggestions, getFunctionSuggestions } from "./suggestions";
import { highlightFormula } from "./highlightFormula";
import { FunctionDocsPanel } from "./FunctionDocPanel";
import { formatAST } from "./formatAst";
import { validateExpression } from "./semanticModeValidators";
import { CopyButton } from "./CopyButton";
import { labelToIdExpr } from "./labelToIdExpr";

const ExpressionBuilder = forwardRef(function ExpressionBuilder(
  {
    value = "",
    label = null,
    schemasById,
    onCommit,
    onChange,
    mode = "BASE",
    semanticMode = "STANDARD",
  },
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

  const schemas = useMemo(() => Object.values(schemasById), [schemasById]);

  // ---------- ID EXPRESSION ----------
  const idExpr = useMemo(
    () => labelToIdExpr(labelExpr, usedSchemas),
    [labelExpr, usedSchemas],
  );

  const highlighted = useMemo(() => highlightFormula(labelExpr), [labelExpr]);

  // ---------- PARSE ----------
  const { ast, dependencies, semanticType } = useMemo(() => {
    if (!idExpr.trim())
      return {
        ast: null,
        dependencies: null,
        semanticType: null,
        error: "Empty expression",
      };

    try {
      const result = buildAST(toPostfix(tokenize(idExpr)), mode);

      if (result?.ast) {
        validateTypes(result.ast, mode, schemasById);
        const semanticType = validateSemantic(result.ast, schemasById);

        if (semanticMode === "AGGREGATE") {
          validateExpression(result.ast);
        }
        result.semanticType = semanticType;
      }

      if (error) {
        setError(null);
      }

      return { ...result, error: null };
    } catch (err) {
      setError(err.message);
      return {
        ast: null,
        dependencies: null,
        semanticType: null,
        error: err.message,
      };
    }
  }, [idExpr, mode, schemasById]);

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
      let cursorOffset = null;

      if (item.type === "schema") {
        insert = `[${item.label}]`;

        setUsedSchemas((prev) =>
          prev.some((c) => c.id === item.id)
            ? prev
            : [...prev, { id: item.id, label: item.label }],
        );
      }
      if (item.type === "function") {
        insert = `${item.name}()`;
        cursorOffset = insert.length - 1; // inside ()
      }

      const before = labelExpr.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");
      const after = labelExpr.slice(cursor);
      const next = `${before}${insert}${after}`;
      setLabelExpr(next);

      const newCursor = before.length + cursorOffset ?? insert.length;
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
      if (e.key === "Enter") {
        e.preventDefault();
        applySuggestion(suggestions[highlight]);
        setHighlight(0);
      }
      if (e.key === "Tab") {
        e.preventDefault();

        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        const newValue =
          labelExpr.substring(0, start) + "\t" + labelExpr.substring(end);

        setLabelExpr(newValue);
        setCursor(start + 1);

        requestAnimationFrame(() => {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 1;
        });

        return;
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

    const detected = schemas.filter((s) => {
      const escaped = s.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\[\\s*${escaped}\\s*\\]`);
      return regex.test(labelExpr);
    });

    setUsedSchemas(detected.map((s) => ({ id: s.id, label: s.label })));
  }, [schemas, labelExpr]);

  // ---------- HANDLE TYPING ----------
  const handleChange = useCallback(
    (e) => {
      setLabelExpr(e.target.value);
      setCursor(e.target.selectionStart);
      setOpen(true);

      onChange?.({
        labelFormula: formatted,
        idFormula: idExpr,
        ast,
        dependencies,
        semanticType,
        error,
      });
    },
    [labelExpr, ast, dependencies, error],
  );

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    const hl = highlightRef.current;
    if (!ta || !hl) return;

    ta.style.height = "auto"; // reset first
    ta.style.height = ta.scrollHeight + "px";

    hl.style.height = ta.style.height; // keep highlight layer same
  }, []);

  const handleBlur = useCallback(() => {
    if (!ast) {
      setOpen(false);
      return;
    }

    let formatted = labelExpr;

    if (labelExpr.length >= 40) {
      formatted = formatAST(ast, 0, schemasById);
      setLabelExpr(formatted);
    } else {
      formatted = formatExpression(labelExpr);
      setLabelExpr(formatted);
    }

    onCommit?.({
      labelFormula: formatted,
      idFormula: idExpr,
      ast,
      dependencies,
      semanticType,
      error,
    });

    if (!formatted.trim()) setError("Expression is required");

    autoResize();

    setOpen(false);
  }, [ast, dependencies, error]);

  useEffect(() => {
    autoResize();
  }, [labelExpr, autoResize]);

  useImperativeHandle(ref, () => ({
    validateNow: () => error,
    getAST: () => ast,
    getDependencies: () => dependencies,
    getExpression: () => labelExpr,
    getSemanticType: () => semanticType,
  }));

  const sharedTextLayer =
    "m-0 p-5 border-0 box-border w-full " +
    "font-mono text-[16px] leading-[1.6] tracking-[0] font-normal " +
    "whitespace-pre-wrap break-words [tab-size:4] " +
    "[font-variant-ligatures:none] [font-feature-settings:'liga'_0] " +
    "[font-kerning:none]";

  return (
    <Section title={label ?? "Expression Query"}>
      <div className="relative w-full">
        <div
          className="
            relative w-full
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
            outline-none resize-none
            overflow-hidden max-h-[300px]
            placeholder:text-(--text-muted)
          `}
          />
          <CopyButton labelExpr={labelExpr} />
        </div>

        {open && suggestions.length > 0 && (
          <FormulaSuggestions
            suggestions={suggestions}
            highlight={highlight}
            onSelect={applySuggestion}
          />
        )}

        <div className="flex items-center justify-between">
          {" "}
          {labelExpr !== null && (
            <FormulaValidation valid={!!ast && !semanticError} error={error} />
          )}
          {!!ast && !semanticError && (
            <span className="text-(--text-muted)">Output: {semanticType}</span>
          )}
        </div>
      </div>
      <FunctionDocsPanel />
      <FunctionDocsPanel mode={mode} />
    </Section>
  );
});

export default ExpressionBuilder;
