import { useState, useMemo } from "react";
import { useTableStore } from "../store";
import { Popup } from "@layout";
import { Input } from "@ui";

const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2 };
const OPS = "+-*/()";

/* ---------------- tokenizer ---------------- */

function tokenize(expr) {
  const tokens = [];
  let buf = "";

  const flushIdentifier = () => {
    if (buf) {
      tokens.push({ type: "identifier", value: buf });
      buf = "";
    }
  };

  const flushNumber = (num) => {
    tokens.push({ type: "number", value: Number(num) });
  };

  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // identifier (column names)
    if (/[a-zA-Z_]/.test(ch)) {
      buf += ch;
      i++;
      continue;
    }

    // number (int or float)
    if (/[0-9.]/.test(ch)) {
      flushIdentifier();
      let num = ch;
      i++;

      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }

      flushNumber(num);
      continue;
    }

    // operators / parens
    if (OPS.includes(ch)) {
      flushIdentifier();
      if (ch === "(") tokens.push({ type: "lparen" });
      else if (ch === ")") tokens.push({ type: "rparen" });
      else tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    // whitespace
    if (ch === " ") {
      flushIdentifier();
      i++;
      continue;
    }

    i++;
  }

  flushIdentifier();
  return tokens;
}

/* ---------------- infix → postfix ---------------- */

function toPostfix(tokens) {
  const out = [];
  const ops = [];

  for (const t of tokens) {
    if (t.type === "identifier" || t.type === "number") {
      out.push(t);
      continue;
    }

    if (t.type === "op") {
      while (
        ops.length &&
        ops[ops.length - 1].type === "op" &&
        PRECEDENCE[ops[ops.length - 1].value] >= PRECEDENCE[t.value]
      ) {
        out.push(ops.pop());
      }
      ops.push(t);
      continue;
    }

    if (t.type === "lparen") {
      ops.push(t);
      continue;
    }

    if (t.type === "rparen") {
      while (ops.length && ops[ops.length - 1].type !== "lparen") {
        out.push(ops.pop());
      }
      ops.pop(); // remove "("
    }
  }

  while (ops.length) out.push(ops.pop());
  return out;
}

/* ---------------- postfix → AST ---------------- */

function buildAST(postfix, labelToId) {
  const stack = [];

  for (const t of postfix) {
    if (t.type === "identifier") {
      const colId = labelToId[t.value.toLowerCase()];
      if (!colId) return null;
      stack.push({ type: "column", columnId: colId });
      continue;
    }

    if (t.type === "number") {
      stack.push({ type: "constant", value: t.value });
      continue;
    }

    if (t.type === "op") {
      if (stack.length < 2) return null;

      const right = stack.pop();
      const left = stack.pop();

      stack.push({
        type: "binary",
        op: t.value,
        left,
        right,
      });
    }
  }

  return stack.length === 1 ? stack[0] : null;
}

/* ================= COMPONENT ================= */

export function MetricBuilder() {
  const activePopup = useTableStore((s) => s.activePopup);
  const columnsById = useTableStore((s) => s.columnsById);
  const addMetric = useTableStore((s) => s.addMetric);
  const closePopup = useTableStore((s) => s.closePopup);

  const numericColumns = Object.values(columnsById).filter(
    (c) => c.type === "number" || c.type === "computed"
  );

  const labelToId = useMemo(() => {
    const map = {};
    numericColumns.forEach((c) => {
      map[c.label.toLowerCase()] = c.id;
    });
    return map;
  }, [numericColumns]);

  const [name, setName] = useState("");
  const [expr, setExpr] = useState("");
  const [cursor, setCursor] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [showSuggestion, setShowSuggestion] = useState(true);

  /* ---------------- AST ---------------- */

  const ast = useMemo(() => {
    try {
      const tokens = tokenize(expr);
      const postfix = toPostfix(tokens);
      return buildAST(postfix, labelToId);
    } catch {
      return null;
    }
  }, [expr, labelToId]);

  /* ---------------- suggestions ---------------- */

  const suggestions = useMemo(() => {
    const m = expr.slice(0, cursor).match(/[a-zA-Z_]+$/);
    if (!m) return [];

    const q = m[0].toLowerCase();
    return numericColumns.filter((c) => c.label.toLowerCase().startsWith(q));
  }, [expr, cursor, numericColumns]);

  function applySuggestion(label) {
    const before = expr.slice(0, cursor).replace(/[a-zA-Z_]+$/, "");
    const after = expr.slice(cursor);
    const next = `${before}${label}${after}`;
    setExpr(next);
  }

  function handleKeyDown(e) {
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
      setShowSuggestion(false);
    }
  }

  function handleSave() {
    if (!name || !ast) return;

    addMetric({
      id: crypto.randomUUID(),
      label: name,
      type: "computed",
      expression: ast,
    });

    closePopup();
  }

  if (activePopup !== "add-metric") return null;

  /* ---------------- UI ---------------- */

  return (
    <Popup
      title="Add Metric"
      text={["Cancel", "Add Metric"]}
      isVisible
      onClose={closePopup}
      onCancel={closePopup}
      onApply={handleSave}
    >
      <div className="space-y-4">
        <Input>
          <Input.Label>Metric Name</Input.Label>
          <Input.Field
            className="p-2! border-2!"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Input>

        <div className="relative">
          <div>
            <Input>
              <Input.Label>Formula</Input.Label>
              <div className="relative">
                <Input.Field
                  className="p-2! border-2!"
                  value={expr}
                  placeholder="eg. (Exit - Entry) * Qty"
                  onKeyDown={handleKeyDown}
                  onBlur={() => setShowSuggestion(false)}
                  onChange={(e) => {
                    setExpr(e.target.value);
                    setCursor(e.target.selectionStart);
                    if (!showSuggestion) setShowSuggestion(true);
                  }}
                />
                {showSuggestion && suggestions.length > 0 && (
                  <div className="absolute bottom-full z-20 w-full bg-(--surface-muted) border border-(--text) rounded shadow">
                    {suggestions.map((c, i) => (
                      <div
                        key={c.id}
                        onMouseDown={() => applySuggestion(c.label)}
                        className={`px-3 py-2 cursor-pointer ${
                          i === highlight ? "bg-(--info)" : ""
                        }`}
                      >
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Input>
          </div>
        </div>

        <div className="text-sm">
          {ast ? (
            <span className="text-green-600">✓ Valid expression</span>
          ) : (
            <span className="text-red-500">⚠ Invalid expression</span>
          )}
        </div>
      </div>
    </Popup>
  );
}
