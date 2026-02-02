const PRECEDENCE = {
  "u-": 4,

  "*": 3,
  "/": 3,

  "+": 2,
  "-": 2,

  ">": 1,
  "<": 1,
  ">=": 1,
  "<=": 1,
  "==": 1,
  "!=": 1,

  AND: 0,
  OR: -1,
};

export function toPostfix(tokens) {
  const out = [];
  const ops = [];

  for (const t of tokens) {
    if (t.type === "identifier" || t.type === "number" || t.type === "string") {
      out.push(t);
      continue;
    }

    if (t.type === "function") {
      ops.push(t);
      continue;
    }

    if (t.type === "comma") {
      // 🔥 FIX
      while (ops.length && ops.at(-1).type !== "lparen") {
        out.push(ops.pop());
      }
      if (!ops.length) {
        throw new Error("Misplaced comma");
      }
      continue;
    }

    if (t.type === "op") {
      const prec = PRECEDENCE[t.value];
      if (prec == null) throw new Error(`Unknown operator: ${t.value}`);

      while (
        ops.length &&
        ops.at(-1).type === "op" &&
        PRECEDENCE[ops.at(-1).value] >= prec
      ) {
        out.push(ops.pop());
      }
      ops.push(t);
      continue;
    }

    if (t.type === "lparen") {
      ops.push(t);
      continue;
    }

    if (t.type === "rparen") {
      while (ops.length && ops.at(-1).type !== "lparen") {
        out.push(ops.pop());
      }
      ops.pop(); // remove '('

      if (ops.length && ops.at(-1).type === "function") {
        out.push(ops.pop());
      }
    }
  }

  return [...out, ...ops.reverse()];
}
