import { COMPUTE_TYPE, SCHEMA_SOURCE, VALUE_TYPE } from "./schemaTypes";

const createSchema = (partial) => {
  if (!partial.id) {
    throw new Error("createColumn: id is required");
  }

  return {
    id: partial.id,
    label: partial.label ?? "",

    // type: partial.type ?? "text",
    // mode: partial.mode ?? "row",
    // editable: partial.editable ?? false,

    source: partial.source ?? SCHEMA_SOURCE.SYSTEM,
    valueType: partial.valueType ?? VALUE_TYPE.NUMBER,
    computeType: partial.computeType ?? COMPUTE_TYPE.ROW,

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
};

export { createSchema };
