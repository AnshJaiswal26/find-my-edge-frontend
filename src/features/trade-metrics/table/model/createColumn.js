const COLUMN_TYPES = [
  "number computed",
  "time computed",
  // "date computed",
  "number",
  "text",
  "date",
  "time",
  "select",
];

const COLUMN_TYPES_LABELS = {
  "number computed": "COMPUTED",
  "time computed": "DURATION",
  // "date computed": "DATE COMPUTED",
  number: "NUMBER",
  text: "TEXT",
  date: "DATE",
  time: "TIME",
  select: "SELECT",
};

const COLUMN_TYPES_GROUP = {
  number: "number",
  "number computed": "number",

  time: "time",

  "time computed": "duration",

  date: "date",

  "date computed": "date",

  text: "text",
  select: "text",
};

function createColumn(partial) {
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

export class schema {
  evaluate(){
    
  }
}

export { COLUMN_TYPES, COLUMN_TYPES_LABELS, COLUMN_TYPES_GROUP, createColumn };
