export const COLUMN_TYPES = [
  "number computed",
  "time computed",
  "date computed",
  "number",
  "text",
  "date",
  "time",
  "select",
];

export function createColumn(partial) {
  if (!partial.id) {
    throw new Error("createColumn: id is required");
  }

  return {
    id: partial.id,
    label: partial.label ?? "",

    type: partial.type ?? "text",
    mode: partial.mode ?? "row",
    editable: partial.editable ?? false,

    expression: partial.expression ?? null,
    formula: partial.formula ?? "",
    dependencies: partial.dependencies ?? [],
    initialValue: partial.initialValue ?? 0,

    display: {
      format: partial.display?.format ?? "",
      decimals: partial.display?.decimals ?? 2,
    },

    colorRules: partial.colorRules ?? [],
    options: partial?.options ?? [],
  };
}
