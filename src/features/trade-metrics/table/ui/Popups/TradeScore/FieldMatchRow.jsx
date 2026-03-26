import { useEffect, useMemo, useRef, useState } from "react";
import { TAG_CONFIG } from "./tagConfig";
import { ArrowRight } from "lucide-react";
import {
  evaluateColorRules,
  FILTER_OPTIONS,
  formatValue,
  isBetween,
} from "@shared/utils";

// ─── Expected value display ───────────────────────────────────────────────────
// Handles three shapes the expected value can arrive in:
//   1. between condition  → { from, to }
//   2. single scalar      → number | string
//   3. null / undefined   → "—"
function ExpectedValue({ match, schema, colors }) {
  const isBet = isBetween(match.condition);
  const { expected, from, to } = useMemo(() => {
    if (isBet) {
      const from = formatValue(match.from, schema.semanticType, schema.display);
      const to = formatValue(match.to, schema.semanticType, schema.display);

      return { expected: null, from, to };
    }
    return {
      expected: formatValue(
        match.expectedValue,
        schema.semanticType,
        schema.display,
      ),
    };
  }, []);

  if (isBet) {
    return (
      <span className="flex items-center gap-1">
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: colors.from }}
        >
          {from}
        </span>
        <span
          className="text-[9px] font-medium uppercase tracking-wide"
          style={{ color: "var(--text-charts-muted)" }}
        >
          to
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: colors.to }}
        >
          {to}
        </span>
      </span>
    );
  }

  return (
    <span
      className="text-[11px] font-semibold tabular-nums"
      style={{ color: colors.expected }}
    >
      {expected}
    </span>
  );
}

// ─── Field match row ──────────────────────────────────────────────────────────
export function FieldMatchRow({ match, index, schemasById }) {
  const [visible, setVisible] = useState(false);
  const rowRef = useRef(null);
  const schema = schemasById?.[match.mappedSchemaId];
  const label = schema?.label || match.mappedSchemaId;
  const tagCfg = TAG_CONFIG[match.tag] || TAG_CONFIG.GOOD;

  const actual = useMemo(
    () => formatValue(match.actualValue, schema.semanticType, schema.display),
    [schema, match.actualValue],
  );

  const colors = useMemo(() => {
    if (schema.colorRules.length === 0) return "var(--text-muted)";

    let colors = {};
    if (isBetween(match.condition)) {
      const from = evaluateColorRules(match.from, schema.colorRules).color;
      const to = evaluateColorRules(match.to, schema.colorRules).color;
      colors = { from, to };
    }
    const expected = evaluateColorRules(
      match.expectedValue,
      schema.colorRules,
    ).color;

    colors = { ...colors, expected };

    const actual = evaluateColorRules(
      match.actualValue,
      schema.colorRules,
    ).color;

    return { ...colors, actual };
  }, [schema, match.expectedValue, match.from, match.to]);

  useEffect(() => {
    const delay = 120 + index * 110;
    const t = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border"
      style={{
        background: "var(--surface-light)",
        borderColor: "var(--border-muted)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      {/* Field info */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span
          className="text-[13px] font-semibold capitalize truncate"
          style={{ color: "var(--text)" }}
        >
          {label}
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Actual value */}
          <span
            className="text-[10px] font-medium tracking-wide"
            style={{ color: "var(--text-charts-muted)" }}
          >
            Actual
          </span>
          <span
            className="text-[11px] font-semibold tabular-nums"
            style={{ color: colors.actual }}
          >
            {actual}
          </span>

          <span className="mx-0.5" style={{ color: "var(--text-muted)" }}>
            <ArrowRight size={10} />
          </span>

          {/* Expected value — scalar or from/to range */}
          <span
            className="text-[10px] font-medium tracking-wide"
            style={{ color: "var(--text-charts-muted)" }}
          >
            Expected {FILTER_OPTIONS[match.condition] || match.condition}
          </span>
          <ExpectedValue match={match} schema={schema} colors={colors} />
        </div>
      </div>

      {/* Tag + match status */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className="text-[10px] font-semibold tracking-wide"
          style={{ color: match.match ? "var(--success)" : "var(--error)" }}
        >
          {match.match ? "✓ Match" : "✗ Miss"}
        </span>
      </div>
    </div>
  );
}
