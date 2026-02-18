const createSchema = (partial) => {
  return {
    id: partial.id ?? null,
    label: partial.label ?? "",

    /* ------------------ TYPE SYSTEM ------------------ */
    type: partial.type ?? "text", // base type
    semanticType: partial.semanticType ?? "string", //  NEW (optional override)

    /* ------------------ COMPUTATION ------------------ */
    mode: partial.mode ?? "row", // row | cumulative | grouped
    ast: partial.ast ?? null,
    formula: partial.formula ?? "",
    dependencies: partial.dependencies ?? [],

    /* ------------------ DATA SOURCE ------------------ */
    source: partial.source ?? "user", // user | system | computed

    /* ------------------ BEHAVIOR ------------------ */
    editable: partial.editable ?? false,
    initialValue: partial.initialValue ?? 0,

    /* ------------------ DISPLAY ------------------ */
    display: {
      format: partial.display?.format ?? "",
      decimals: partial.display?.decimals ?? 2,
    },

    /* ------------------ UI ------------------ */
    colorRules: partial.colorRules ?? [],
    options: partial?.options ?? [],
  };
};

export { createSchema };
