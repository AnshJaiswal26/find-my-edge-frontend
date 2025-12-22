export function buildAST(postfix, labelToId) {
  const stack = [];

  for (const t of postfix) {
    if (t.type === "identifier") {
      const colId = labelToId[t.value.toLowerCase()];
      if (!colId) return null;
      stack.push({ type: "column", columnId: colId });
    }

    if (t.type === "number") {
      stack.push({ type: "constant", value: t.value });
    }

    if (t.type === "op") {
      if (stack.length < 2) return null;
      const right = stack.pop();
      const left = stack.pop();
      stack.push({ type: "binary", op: t.value, left, right });
    }
  }

  return stack.length === 1 ? stack[0] : null;
}
