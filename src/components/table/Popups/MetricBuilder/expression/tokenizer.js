const OPS = "+-*/()";

export function tokenize(expr) {
  const tokens = [];
  let buf = "";

  const flushIdentifier = () => {
    if (buf) {
      tokens.push({ type: "identifier", value: buf });
      buf = "";
    }
  };

  const flushNumber = (num) => {
    tokens.push({ type: "number", value: Number(num) });
  };

  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (/[a-zA-Z_]/.test(ch)) {
      buf += ch;
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      flushIdentifier();
      let num = ch;
      i++;
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }
      flushNumber(num);
      continue;
    }

    if (OPS.includes(ch)) {
      flushIdentifier();
      if (ch === "(") tokens.push({ type: "lparen" });
      else if (ch === ")") tokens.push({ type: "rparen" });
      else tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    if (ch === " ") flushIdentifier();
    i++;
  }

  flushIdentifier();
  return tokens;
}
