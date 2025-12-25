const OPS = "+-*/()";

export function tokenize(expr) {
  const tokens = [];
  let buf = "";

  const flushIdentifier = () => {
    if (buf) {
      const t = { type: "identifier", value: buf };
      tokens.push(t);
      prevToken = t; // 🔥 IMPORTANT
      buf = "";
    }
  };

  const flushNumber = (num) => {
    const t = { type: "number", value: Number(num) };
    tokens.push(t);
    prevToken = t;
  };

  let i = 0;
  let prevToken = null;
  let parenBalance = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // whitespace
    if (ch === " ") {
      flushIdentifier();
      i++;
      continue;
    }

    // bracketed identifier: [T  N]
    if (ch === "[") {
      i++; // skip '['
      let name = "";

      while (i < expr.length && expr[i] !== "]") {
        name += expr[i++];
      }

      if (expr[i] !== "]") {
        throw new Error("Unclosed [");
      }

      i++; // skip ']'

      const t = { type: "identifier", value: name.trim() };
      tokens.push(t);
      prevToken = t;
      continue;
    }

    // identifier (supports hyphen inside)
    if (/[a-zA-Z_]/.test(ch)) {
      buf += ch;
      i++;

      while (i < expr.length && /[a-zA-Z0-9_-]/.test(expr[i])) {
        // ❗ prevent leading or trailing '-'
        if (
          expr[i] === "-" &&
          (!/[a-zA-Z0-9_]/.test(expr[i - 1]) ||
            !/[a-zA-Z0-9_]/.test(expr[i + 1]))
        ) {
          break;
        }

        buf += expr[i++];
      }

      continue;
    }

    flushIdentifier();

    // 🔥 unary minus (FIX)
    const isUnaryMinus =
      ch === "-" &&
      (prevToken === null ||
        prevToken.type === "op" ||
        prevToken.type === "lparen");

    if (isUnaryMinus) {
      tokens.push({ type: "op", value: "u-" });
      prevToken = tokens[tokens.length - 1];
      i++;
      continue;
    }

    // number
    if (/[0-9.]/.test(ch)) {
      let num = "";
      let dotCount = 0;

      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        if (expr[i] === "." && ++dotCount > 1) {
          throw new Error("Invalid number");
        }
        num += expr[i++];
      }

      if (!/^\d+(\.\d+)?$/.test(num)) {
        throw new Error("Invalid number");
      }

      flushNumber(num);
      continue;
    }

    // operators & parentheses
    if (OPS.includes(ch)) {
      if (ch === "(") {
        tokens.push({ type: "lparen" });
        prevToken = tokens[tokens.length - 1];
        parenBalance++;
      } else if (ch === ")") {
        parenBalance--;
        if (parenBalance < 0) {
          throw new Error("Unmatched closing parenthesis");
        }
        tokens.push({ type: "rparen" });
        prevToken = tokens[tokens.length - 1];
      } else {
        tokens.push({ type: "op", value: ch });
        prevToken = tokens[tokens.length - 1];
      }
      i++;
      continue;
    }

    throw new Error(`Invalid character: ${ch}`);
  }

  flushIdentifier();

  if (parenBalance !== 0) {
    throw new Error("Unmatched opening parenthesis");
  }

  return tokens;
}
