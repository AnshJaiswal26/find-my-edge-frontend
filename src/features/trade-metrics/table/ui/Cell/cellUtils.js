import { formatValue } from "@shared/utils";
import { useTradeStore } from "@shared/stores";
import { showTooltip } from "@shared/components/ui/tooltip";
import { SCHEMA_COMPUTE_MODE, SEMANTIC_TYPE } from "@lib/analytics/schema";
import { highlightFormula } from "@shared/components/ui/ExpressionBuilder/highlightFormula";
import { containsWindowFunction } from "@lib/expression/ast";

export const prepareSchemaMeta = (schema) => {
  const highlightedFormula = highlightFormula(schema.idFormula);

  const windowFns = [];
  if (schema.mode === SCHEMA_COMPUTE_MODE.CUMULATIVE) {
    containsWindowFunction(schema.ast, (fn) => windowFns.push(fn));
  }

  return {
    highlightedFormula,
    windowFns,
  };
};

const tooltipCache = new Map();
const schemaMetaCache = new Map(); // local meta cache

const getKey = (rowId, colId) => `${rowId}_${colId}`;

export const handleShowTooltip = (e, { type, value, colId, rowId, color }) => {
  // ✅ STRING CASE (UNCHANGED)
  if (type === SEMANTIC_TYPE.STRING) {
    if (value.length > 100) {
      showTooltip(e, {
        content: `<span style="color: var(--text);">${value}</span>`,
        tooltipStyle: {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          border: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        },
        arrowStyle: {
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        },
      });
    }
    return;
  }

  const key = getKey(rowId, colId);

  // ✅ CACHE HIT
  if (tooltipCache.has(key)) {
    const cached = tooltipCache.get(key);

    showTooltip(e, {
      tooltipStyle: cached.tooltipStyle,
      arrowStyle: cached.arrowStyle,
      render: () => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "column";

        div.innerHTML = `
          <div style="color: var(--text)">${cached.labelExp}</div>
<!--          <div style="color: var(&#45;&#45;text)">${cached.valueExp}</div>-->
          <div style="color: ${color || "var(--text)"}">= ${value}</div>
        `;
        return div;
      },
    });

    return;
  }

  // ❗ CACHE MISS → FULL ORIGINAL LOGIC (but optimized)
  const state = useTradeStore.getState();
  const schema = state.schemasById[colId];

  if (!schema || !schema.dependencies?.length) return;

  const tradeRaw = state.tradesById[rowId];
  const tradeComputed = state.derivedByTradeId[rowId];

  // ✅ highlightFormula (cached)
  let htmlFormula = schemaMetaCache.get(colId)?.highlightedFormula;
  if (!htmlFormula) {
    htmlFormula = highlightFormula(schema.idFormula);
  }

  // ✅ KEEP @{...} replacement (YOU ASKED THIS)
  let htmlExp = htmlFormula.replace(/@\{([^}]+)\}/g, "$1");

  let labelExp = htmlExp;
  let valueExp = htmlExp;

  // ✅ window fn detection (cached)
  let windowFns = schemaMetaCache.get(colId)?.windowFns;
  if (!windowFns) {
    windowFns = [];
    if (schema.mode === SCHEMA_COMPUTE_MODE.CUMULATIVE) {
      containsWindowFunction(schema.ast, (fn) => windowFns.push(fn));
    }

    schemaMetaCache.set(colId, {
      highlightedFormula: htmlFormula,
      windowFns,
    });
  }

  // ✅ dependency replacement (UNCHANGED)
  schema.dependencies.forEach((dep) => {
    const depSchema = state.schemasById[dep];
    const val = tradeRaw[dep] ?? tradeComputed[dep] ?? null;

    if (val !== null) {
      const fV = formatValue(val, depSchema.semanticType, depSchema.display);

      labelExp = labelExp.replace(
        new RegExp(dep, "g"),
        `${depSchema.label}=${fV}`,
      );
      // valueExp = valueExp.replace(new RegExp(dep, "g"), fV);
    }
  });

  // ✅ YOUR window fn regex (UNCHANGED)
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  windowFns.forEach((fn) => {
    const safeFn = escapeRegex(fn);

    const regex = new RegExp(
      `(<span[^>]*>${safeFn}</span>(?:<span[^>]*></span>)*)\\(`,
      "g",
    );

    labelExp = labelExp.replace(regex, "$1(...");
  });

  const cachedData = {
    labelExp,
    valueExp,
    tooltipStyle: {
      border: "1px solid var(--border)",
      backgroundColor: "var(--surface)",
      maxWidth: "max-content",
    },
    arrowStyle: {
      border: "1px solid var(--border)",
      backgroundColor: "var(--surface)",
    },
  };

  tooltipCache.set(key, cachedData);

  // ✅ FINAL SHOW (UNCHANGED STYLE)
  showTooltip(e, {
    tooltipStyle: cachedData.tooltipStyle,
    arrowStyle: cachedData.arrowStyle,
    render: () => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "column";

      div.innerHTML = `
        <div style="color: var(--text)">${labelExp}</div>
        <div style="color: ${color || "var(--text)"}">= ${value}</div>
      `;

      return div;
    },
  });
};

// <div style="color: var(--text)">${valueExp}</div>;
