import { FUNCTION_REGISTRY } from "../functions/registry";

const OPS = "+-*/()";
const FUNCTIONS = new Set(Object.keys(FUNCTION_REGISTRY));
const COMPARATORS = ["<=", ">=", "==", "!=", "<", ">"];

export function tokenize(expr) {
  const tokens = [];
  let buf = "";

  let i = 0;
  let prevToken = null;
  let parenBalance = 0;

  const flushIdentifier = () => {
    if (!buf) return;

    const isFunction = FUNCTIONS.has(buf) && expr[i] === "(";

    const t = {
      type: isFunction ? "function" : "identifier",
      value: buf,
    };

    tokens.push(t);
    prevToken = t;
    buf = "";
  };

  const flushNumber = (num) => {
    const t = { type: "number", value: Number(num) };
    tokens.push(t);
    prevToken = t;
  };

  while (i < expr.length) {
    const ch = expr[i];

    /* ---------- whitespace ---------- */
    if (ch === " ") {
      flushIdentifier();
      i++;
      continue;
    }

    /* ---------- bracketed identifier [Trade PnL] ---------- */
    if (ch === "[") {
      flushIdentifier();
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

    // ---------- comparison operators ----------
    let matchedComparator = false;

    for (const op of COMPARATORS) {
      if (expr.slice(i, i + op.length) === op) {
        flushIdentifier();
        tokens.push({ type: "op", value: op });
        prevToken = tokens.at(-1);
        i += op.length;
        matchedComparator = true;
        break;
      }
    }

    if (matchedComparator) continue;

    /* ---------- identifier / function ---------- */
    if (/[a-zA-Z_]/.test(ch)) {
      buf += ch;
      i++;

      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        buf += expr[i++];
      }

      continue;
    }

    flushIdentifier();

    /* ---------- unary minus ---------- */
    const isUnaryMinus =
      ch === "-" &&
      (prevToken === null ||
        prevToken.type === "op" ||
        prevToken.type === "lparen" ||
        prevToken.type === "function");

    if (isUnaryMinus) {
      const t = { type: "op", value: "u-" };
      tokens.push(t);
      prevToken = t;
      i++;
      continue;
    }

    /* ---------- number ---------- */
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

    /* ---------- comma (function argument separator) ---------- */
    if (ch === ",") {
      flushIdentifier();
      tokens.push({ type: "comma" });
      prevToken = null;
      i++;
      continue;
    }

    /* ---------- operators & parentheses ---------- */
    if (OPS.includes(ch)) {
      if (ch === "(") {
        const t = { type: "lparen" };
        tokens.push(t);
        prevToken = t;
        parenBalance++;
      } else if (ch === ")") {
        parenBalance--;
        if (parenBalance < 0) {
          throw new Error("Unmatched closing parenthesis");
        }
        const t = { type: "rparen" };
        tokens.push(t);
        prevToken = t;
      } else {
        const t = { type: "op", value: ch };
        tokens.push(t);
        prevToken = t;
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
