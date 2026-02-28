import { SchemaSource } from "@lib/analytics/schema";
import { useTableStore } from "@features/trade-metrics/table/store";
import { formatValue } from "@shared/utils";

function isSafeIdentifier(label) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(label);
}

export function explainFormulaFromColumn(colId, rowId) {
  const { columnsById, rowsById } = useTableStore.getState();

  const column = columnsById[colId];
  const row = rowsById[rowId];

  if (
    column.source !== SchemaSource.COMPUTED ||
    !column.formula ||
    !column.dependencies?.length
  ) {
    return null;
  }

  let expanded = column.formula;

  column.dependencies.forEach((depColId) => {
    const depColumn = columnsById[depColId];
    if (!depColumn) return;

    const label = depColumn.label;
    const value = row.cells[depColId]?.value ?? 0;

    if (isSafeIdentifier(label)) {
      // replace whole-word identifiers only
      const re = new RegExp(`\\b${label}\\b`, "g");
      expanded = expanded.replace(
        re,
        formatValue(value, depColumn.type, depColumn.display),
      );
    } else {
      // replace [Label Name]
      expanded = expanded.replaceAll(
        `[${label}]`,
        formatValue(value, depColumn.type, depColumn.display),
      );
    }
  });

  return {
    formula: column.formula,
    expanded,
    result: formatValue(
      row.cells[colId]?.value,
      column.semanticType,
      column.display,
    ),
  };
}
