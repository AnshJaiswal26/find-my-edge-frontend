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
};

export function toPostfix(tokens) {
  // console.log(tokens);

  const out = [];
  const ops = [];

  for (const t of tokens) {
    if (t.type === "identifier" || t.type === "number") {
      out.push(t);
      if (t.type === "identifier") continue;
    }

    if (t.type === "function") {
      ops.push(t); // push function
      continue;
    }

    if (t.type === "op") {
      while (
        ops.length &&
        ops.at(-1).type === "op" &&
        PRECEDENCE[ops.at(-1).value] >= PRECEDENCE[t.value]
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
      ops.pop(); // remove lparen

      // 🔥 if function is on top, pop it
      if (ops.length && ops.at(-1).type === "function") {
        out.push(ops.pop());
      }
    }
  }

  return [...out, ...ops.reverse()];
}
