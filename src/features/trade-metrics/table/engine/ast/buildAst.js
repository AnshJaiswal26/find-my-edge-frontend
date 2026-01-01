export function buildAST(postfix, labelToId) {
  // console.log(postfix);

  const stack = [];
  const dependency = [];

  for (const t of postfix) {
    /* ---------- FUNCTION ---------- */
    if (t.type === "function") {
      const name = t.value.toLowerCase();

      if (name === "prev") {
        const arg = stack.pop();
        if (!arg || arg.type !== "column") return null;

        // 🔥 PREV(column)
        stack.push({
          type: "prev",
          columnId: arg.columnId,
        });

        continue;
      }

      return null;
    }

    /* ---------- IDENTIFIER ---------- */
    if (t.type === "identifier") {
      const colId = labelToId[t.value.toLowerCase()];
      if (!colId) return null;

      stack.push({ type: "column", columnId: colId });
      dependency.push(colId);
      continue;
    }

    /* ---------- NUMBER ---------- */
    if (t.type === "number") {
      stack.push({ type: "constant", value: t.value });
      continue;
    }

    /* ---------- OPERATOR ---------- */
    if (t.type === "op") {
      if (t.value === "u-") {
        if (stack.length < 1) return null;
        const arg = stack.pop();
        stack.push({ type: "unary", op: "-", arg });
        continue;
      }

      if (stack.length < 2) return null;
      const right = stack.pop();
      const left = stack.pop();
      stack.push({ type: "binary", op: t.value, left, right });
    }
  }

  return {
    ast: stack.length === 1 ? stack[0] : null,
    dependency,
  };
}
