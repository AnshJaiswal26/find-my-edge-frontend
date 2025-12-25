export function buildAST(postfix, labelToId) {
  const stack = [];
  const dependency = [];

  for (const t of postfix) {
    if (t.type === "identifier") {
      const colId = labelToId[t.value.toLowerCase()];
      if (!colId) return null;
      stack.push({ type: "column", columnId: colId });
      dependency.push(t.value);
      continue;
    }

    if (t.type === "number") {
      stack.push({ type: "constant", value: t.value });
      continue;
    }

    if (t.type === "op") {
      // 🔥 unary minus
      if (t.value === "u-") {
        if (stack.length < 1) return null;
        const arg = stack.pop();
        stack.push({ type: "unary", op: "-", arg });
        continue;
      }

      // binary operators
      if (stack.length < 2) return null;
      const right = stack.pop();
      const left = stack.pop();
      stack.push({ type: "binary", op: t.value, left, right });
    }
  }

  return { ast: stack.length === 1 ? stack[0] : null, dependency };
}
