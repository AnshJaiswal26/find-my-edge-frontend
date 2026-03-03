import {
  SchemaComputeMode,
  SchemaRole,
  SchemaSource,
  SchemaType,
  SemanticType,
} from "./schemaTypes";

const createSchema = (partial) => {
  return {
    id: partial.id ?? null,
    label: partial.label ?? "",

    /* ------------------ TYPE SYSTEM ------------------ */
    type: partial.type ?? SchemaType.TEXT, // base type
    semanticType: partial.semanticType ?? SemanticType.STRING, //  NEW (optional override)

    /* ------------------ COMPUTATION ------------------ */
    mode: partial.mode ?? SchemaComputeMode.ROW, // row | cumulative
    ast: partial.ast ?? null,
    formula: partial.formula ?? "", // formula in UI format (e.g. with labels instead of ids)
    idFormula: partial.idFormula ?? "", // formula in engine format (e.g. with ids instead of labels)

    dependencies: partial.dependencies ?? [],

    /* ------------------ DATA SOURCE ------------------ */
    source: partial.source ?? SchemaSource.USER, // user | system | computed
    role: partial.role ?? SchemaRole.USER_DEFINED, // system_ | metric

    /* ------------------ BEHAVIOR ------------------ */
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
