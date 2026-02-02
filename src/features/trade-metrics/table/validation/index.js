const isDuplicateLabel = (draft, columns, activeColumn) => {
  const newLabel = draft.label?.trim().toLowerCase();
  if (!newLabel) return false;

  return columns.some((col) => {
    if (activeColumn && col.id === activeColumn.id) return false;

    return col?.label?.trim().toLowerCase() === newLabel;
  });
};

export const isValid = (draft, setError, ctx) => {
  if (!draft.label.trim()) {
    setError({ input: "Label is required" });
    return false;
  }

  if (draft.type.includes("computed") && !draft.expression) {
    setError({ ast: "Expression is required" });
    return false;
  }

  if (ctx && ctx?.columns) {
    if (isDuplicateLabel(draft, ctx.columns, ctx.activeColumn)) {
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
      setError({ select: "Options is required" });
      return false;
    }
  }

  setError(null);
  return true;
};
