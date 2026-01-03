export const FUNCTION_ARITY = {
  PREV: 1,
  SELF: 0,
  CUM: 1, // optional start handled in eval
  SUM: 1,
  AVG: 2,
  RESET: 2,
  IF: 3,
};

export function buildAST(postfix, labelToId) {
  // console.log(postfix);

  const stack = [];
  const dependency = [];

  for (const t of postfix) {
    /* ---------- FUNCTION ---------- */
    if (t.type === "function") {
      const name = t.value.toUpperCase();

      // how many args?
      const arity = FUNCTION_ARITY[name];
      if (!arity) return null;

      const args = [];
      for (let i = 0; i < arity; i++) {
        args.unshift(stack.pop());
      }

      stack.push({
        type: "function",
        name,
        args,
      });

      continue;
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
