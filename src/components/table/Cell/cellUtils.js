import { useTableStore } from "../store";

function isSafeIdentifier(label) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(label);
}

export function explainFormulaFromColumn(column, rowId) {
  const { columnsById, rowsById } = useTableStore.getState();
  const row = rowsById[rowId];

  if (
    column.type !== "computed" ||
    !column.formula ||
    !column.dependsOn?.length
  ) {
    return null;
  }

  let expanded = column.formula;

  column.dependsOn.forEach((depColId) => {
    const depColumn = columnsById[depColId];
    if (!depColumn) return;

    const label = depColumn.label;
    const value = row.cells[depColId]?.value ?? 0;

    if (isSafeIdentifier(label)) {
      // replace whole-word identifiers only
      const re = new RegExp(`\\b${label}\\b`, "g");
      expanded = expanded.replace(re, String(value));
    } else {
      // replace [Label Name]
      expanded = expanded.replaceAll(`[${label}]`, String(value));
    }
  });

  return { formula: column.formula, expanded };
}
