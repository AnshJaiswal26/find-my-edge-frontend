export const labelToIdExpr = (expr, usedSchemas) => {
  let result = expr;

  for (const sch of usedSchemas) {
    const safeLabel = sch.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // ONLY replace full bracketed identifiers
    const bracketRegex = new RegExp(`\\[\\s*${safeLabel}\\s*\\]`, "g");

    result = result.replace(bracketRegex, `@{${sch.id}}`);
  }

  return result;
};
