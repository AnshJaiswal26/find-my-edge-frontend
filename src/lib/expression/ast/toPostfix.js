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
  const fnStack = [];
  let prevToken = null;

  const isValueStart = (t) =>
    t.type === "identifier" ||
    t.type === "number" ||
    t.type === "string" ||
    t.type === "function" ||
    t.type === "lparen";

  for (const t of tokens) {
    const ctx = fnStack.at(-1);

    if (ctx && !ctx.expectingArg && prevToken) {
      const prevEndsExpr =
        prevToken.type === "identifier" ||
        prevToken.type === "number" ||
        prevToken.type === "string" ||
        prevToken.type === "rparen";

      const currStartsExpr =
        t.type === "identifier" ||
        t.type === "number" ||
        t.type === "string" ||
        t.type === "function" ||
        t.type === "lparen";

      if (prevEndsExpr && currStartsExpr) {
        throw new Error("Missing operator or comma between arguments");
      }
    }

    /* ---------- VALUE OR SUBEXPR START ---------- */
    if (isValueStart(t)) {
      if (ctx && ctx.expectingArg) {
        ctx.expectingArg = false;
        ctx.argCount++;
      }
    }

    /* ---------- VALUES ---------- */
    if (t.type === "identifier" || t.type === "number" || t.type === "string") {
      out.push(t);
      prevToken = t;
      continue;
    }

    /* ---------- FUNCTION ---------- */
    if (t.type === "function") {
      ops.push(t);
      prevToken = t;
      continue;
    }

    /* ---------- LEFT PAREN ---------- */
    if (t.type === "lparen") {
      if (ops.length && ops.at(-1).type === "function") {
        fnStack.push({
          argCount: 0,
          expectingArg: true,
          parenDepth: 0, // track inner grouping
        });
      } else if (ctx) {
        ctx.parenDepth++; // nested grouping inside function argument
      }

      ops.push(t);
      prevToken = t;
      continue;
    }

    /* ---------- COMMA ---------- */
    if (t.type === "comma") {
      if (!ctx) throw new Error("Comma after closing parenthesis not allowed");
      if (ctx.expectingArg) throw new Error("Unexpected comma");

      ctx.expectingArg = true;

      while (ops.length && ops.at(-1).type !== "lparen") {
        out.push(ops.pop());
      }
      if (!ops.length) throw new Error("Misplaced comma");

      prevToken = t;
      continue;
    }

    /* ---------- OPERATOR ---------- */
    if (t.type === "op") {
      const prec = PRECEDENCE[t.value];
      if (prec == null) throw new Error(`Unknown operator: ${t.value}`);

      if (ctx && ctx.expectingArg && t.value !== "u-") {
        throw new Error("Argument expected before operator");
      }

      while (
        ops.length &&
        ops.at(-1).type === "op" &&
        PRECEDENCE[ops.at(-1).value] >= prec
      ) {
        out.push(ops.pop());
      }

      ops.push(t);
      prevToken = t;
      continue;
    }

    /* ---------- RIGHT PAREN ---------- */
    if (t.type === "rparen") {
      while (ops.length && ops.at(-1).type !== "lparen") {
        out.push(ops.pop());
      }
      if (!ops.length) throw new Error("Mismatched parentheses");

      ops.pop(); // remove '('

      const ctx = fnStack.at(-1);
      if (ctx) {
        if (ctx.parenDepth > 0) {
          ctx.parenDepth--; // closing grouping, not function call
        } else {
          // closing function call
          if (ctx.expectingArg && ctx.argCount > 0) {
            throw new Error("Trailing comma in function arguments");
          }

          const fn = ops.pop();
          fn.argCount = ctx.argCount;
          out.push(fn);
          fnStack.pop();
        }
      }

      prevToken = t;
      continue;
    }
  }

  while (ops.length) {
    const op = ops.pop();
    if (op.type === "lparen" || op.type === "rparen") {
      throw new Error("Mismatched parentheses");
    }
    out.push(op);
  }

  return out;
}
