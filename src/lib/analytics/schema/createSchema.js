import {
  SCHEMA_COMPUTE_MODE,
  SCHEMA_ROLE,
  SCHEMA_SOURCE,
  SCHEMA_TYPE,
  SEMANTIC_TYPE,
} from "./schemaTypes";

const createSchema = (partial) => {
  return {
    id: partial.id ?? null,
    label: partial.label ?? "",

    /* ------------------ TYPE SYSTEM ------------------ */
    type: partial.type ?? SCHEMA_TYPE.TEXT, // base type
    semanticType: partial.semanticType ?? SEMANTIC_TYPE.STRING, //  NEW (optional override)

    /* ------------------ COMPUTATION ------------------ */
    mode: partial.mode ?? SCHEMA_COMPUTE_MODE.ROW, // row | cumulative
    ast: partial.ast ?? null,
    formula: partial.formula ?? "", // formula in UI format (e.g. with labels instead of ids)
    idFormula: partial.idFormula ?? "", // formula in engine format (e.g. with ids instead of labels)

    dependencies: partial.dependencies ?? [],

    /* ------------------ DATA SOURCE ------------------ */
    source: partial.source ?? SCHEMA_SOURCE.USER, // user | system | computed
    role: partial.role ?? SCHEMA_ROLE.USER_DEFINED, // system_ | metric

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
