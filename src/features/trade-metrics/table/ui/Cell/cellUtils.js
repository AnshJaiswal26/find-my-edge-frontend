import { formatValue } from "@shared/utils";
import { useTradeStore } from "@shared/stores";
import { showTooltip } from "@shared/components/ui/tooltip";
import { SEMANTIC_TYPE } from "@lib/analytics/schema";
import { highlightFormula } from "@shared/components/ui/ExpressionBuilder/highlightFormula";
import { formatExpression } from "@shared/components/ui/ExpressionBuilder/formatExpression";

export const handleShowTooltip = (e, { type, value, colId, rowId, color }) => {
  if (type === SEMANTIC_TYPE.STRING) {
    value.length > 100
      ? showTooltip(e, value, null, {
          allowHTML: true,
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
        })
      : null;

    return;
  }

  const state = useTradeStore.getState();
  const schema = state.schemasById[colId];

  if (!schema || !schema.dependencies?.length) return;

  const trade = state.tradesById[rowId];

  const htmlFormula = highlightFormula(schema.formula);

  let exp = schema.idFormula.replace(/@\{([^}]+)\}/g, "$1");

  schema.dependencies.forEach((dep) => {
    const schema = state.schemasById[dep];
    const value = trade[dep];
    const fV = formatValue(value, schema.semanticType, schema.display);
    exp = exp.replace(new RegExp(dep, "g"), dep + " ");
    exp = exp.replace(new RegExp(dep, "g"), fV);
  });

  exp = formatExpression(exp);

  console.log(htmlFormula);

  showTooltip(e, "", null, {
    tooltipStyle: {
      border: "1px solid var(--border)",
      backgroundColor: "var(--surface)",
    },
    arrowStyle: {
      borderRight: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      backgroundColor: "var(--surface)",
    },
    render: () => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.innerHTML = `
        <div style="color: var(--text)">${htmlFormula}</div>
        <div style="color: var(--text)">${exp}</div>
        <div style="color: ${color || "var(--text)"}">= ${value}</div>`;
      return div;
    },
  });
};
