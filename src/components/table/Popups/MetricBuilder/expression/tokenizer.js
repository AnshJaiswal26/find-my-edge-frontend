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

    // identifier
    if (/[a-zA-Z_]/.test(ch)) {
      buf += ch;
      i++;
      continue;
    }

    // unary minus → negative number
    const isUnaryMinus =
      ch === "-" &&
      (prevToken === null ||
        prevToken.type === "op" ||
        prevToken.type === "lparen");

    // number (including negative)
    if (/[0-9.]/.test(ch) || isUnaryMinus) {
      flushIdentifier();

      let num = "";
      let dotCount = 0;

      if (isUnaryMinus) {
        num += "-";
        i++;
      }

      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        if (expr[i] === "." && ++dotCount > 1) {
          throw new Error("Invalid number");
        }
        num += expr[i++];
      }

      if (num === "-" || num === "") {
        throw new Error("Invalid number");
      }

      flushNumber(num);
      prevToken = tokens[tokens.length - 1];
      continue;
    }

    // operators & parentheses
    if (OPS.includes(ch)) {
      flushIdentifier();

      if (ch === "(") {
        tokens.push({ type: "lparen" });
        parenBalance++;
      } else if (ch === ")") {
        parenBalance--;
        if (parenBalance < 0) {
          throw new Error("Unmatched closing parenthesis");
        }
        tokens.push({ type: "rparen" });
      } else {
        tokens.push({ type: "op", value: ch });
      }

      prevToken = tokens[tokens.length - 1];
      i++;
      continue;
    }

    // invalid characters
    throw new Error(`Invalid character: ${ch}`);
  }

  flushIdentifier();

  if (parenBalance !== 0) {
    throw new Error("Unmatched opening parenthesis");
  }

  return tokens;
}
