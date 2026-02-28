import { SchemaSource } from "@lib/analytics/schema";

const isDuplicateLabel = (draft, ctx) => {
  const newLabel = draft.label?.trim().toLowerCase();
  if (!newLabel) return false;

  return ctx.columnsOrder.some((id) => {
    const col = ctx.columnsById[id];
    if (ctx?.activeColumn && col.id === ctx.activeColumn.id) return false;

    return col?.label?.trim().toLowerCase() === newLabel;
  });
};

export const isValid = (draft, setError, ctx) => {
  if (!draft.label.trim()) {
    setError({ input: "Label is required" });
    return false;
  }

  if (draft.source === SchemaSource.COMPUTEDs && !draft.ast) {
    setError({ ast: "Expression is required" });
    return false;
  }

  if (ctx && ctx?.columnsById) {
    if (isDuplicateLabel(draft, ctx)) {
      setError({ input: "A column with this label already exists" });
      return false;
    }
  }

  if (draft.type === "select") {
    if (
      !draft.options ||
      draft.options.length === 0 ||
      !draft.options.every((o) => o.trim())
    ) {
      setError({ select: "Options are required" });
      return false;
    }
  }

  setError(null);
  return true;
};
