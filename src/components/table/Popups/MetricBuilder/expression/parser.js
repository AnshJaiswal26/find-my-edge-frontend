const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2 };

export function toPostfix(tokens) {
  const out = [];
  const ops = [];

  for (const t of tokens) {
    if (t.type === "identifier" || t.type === "number") {
      out.push(t);
      continue;
    }

    if (t.type === "op") {
      while (
        ops.length &&
        ops[ops.length - 1].type === "op" &&
        PRECEDENCE[ops[ops.length - 1].value] >= PRECEDENCE[t.value]
      ) {
        out.push(ops.pop());
      }
      ops.push(t);
      continue;
    }

    if (t.type === "lparen") ops.push(t);

    if (t.type === "rparen") {
      while (ops.length && ops.at(-1).type !== "lparen") {
        out.push(ops.pop());
      }
      ops.pop();
    }
  }

  return [...out, ...ops.reverse()];
}
