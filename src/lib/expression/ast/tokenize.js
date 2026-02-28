import { FunctionRegistry } from "@lib/analytics/engine/functions";
import { TokenType } from "./tokenType";

const OPS = "+-*/()";
const COMPARATORS = ["<=", ">=", "==", "!=", "<", ">"];
const LOGICAL_OPS = new Set(["AND", "OR"]);

export function tokenize(expr) {
  const tokens = [];
  let buf = "";

  let i = 0;
  let prevToken = null;
  let parenBalance = 0;

  const flushIdentifier = () => {
    if (!buf) return;

    const upper = buf.toUpperCase();

    // Logical operators
    if (LOGICAL_OPS.has(upper)) {
      const t = { type: TokenType.OPERATOR, value: upper };
      tokens.push(t);
      prevToken = t;
      buf = "";
      return;
    }

    const isFunction = FunctionRegistry[upper] && expr[i] === "(";

    const t = {
      type: isFunction ? TokenType.FUNCTION : TokenType.IDENTIFIER,
      value: buf,
    };

    tokens.push(t);
    prevToken = t;
    buf = "";
  };

  const flushNumber = (num) => {
    const t = { type: TokenType.NUMBER, value: Number(num) };
    tokens.push(t);
    prevToken = t;
  };

  while (i < expr.length) {
    const ch = expr[i];

    /* ---------- whitespace ---------- */
    if (/\s/.test(ch)) {
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

      const t = { type: TokenType.IDENTIFIER, value: name.trim() };
      tokens.push(t);
      prevToken = t;
      continue;
    }

    if (ch === "@" && expr[i + 1] === "{") {
      flushIdentifier();
      i += 2; // skip '@{'

      let id = "";
      while (i < expr.length && expr[i] !== "}") {
        id += expr[i++];
      }

      if (expr[i] !== "}") throw new Error("Unclosed @{");

      i++; // skip '}'

      const t = { type: TokenType.IDENTIFIER, value: id.trim(), isId: true };
      tokens.push(t);
      prevToken = t;
      continue;
    }

    /* ---------- string constant "..." ---------- */
    if (ch === '"') {
      flushIdentifier();
      i++; // skip opening quote
      let str = "";

      while (i < expr.length && expr[i] !== '"') {
        str += expr[i++];
      }

      if (expr[i] !== '"') throw new Error("Unclosed string literal");

      i++; // skip closing quote

      const t = { type: TokenType.STRING, value: str };
      tokens.push(t);
      prevToken = t;
      continue;
    }

    // ---------- comparison operators ----------
    let matchedComparator = false;

    for (const op of COMPARATORS) {
      if (expr.slice(i, i + op.length) === op) {
        flushIdentifier();
        tokens.push({ type: TokenType.OPERATOR, value: op });
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
        prevToken.type === TokenType.OPERATOR ||
        prevToken.type === TokenType.LPAREN ||
        prevToken.type === TokenType.FUNCTION);

    if (isUnaryMinus) {
      const t = { type: TokenType.OPERATOR, value: "u-" };
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

      const prev = tokens[tokens.length - 1];
      const next = expr[i + 1];

      // No leading comma or double comma
      if (
        !prev ||
        prev.type === TokenType.COMMA ||
        prev.type === TokenType.LPAREN
      ) {
        throw new Error("Unexpected comma");
      }

      // No trailing comma before ')'
      if (next === ")") {
        throw new Error("Comma before closing parenthesis not allowed");
      }

      tokens.push({ type: TokenType.COMMA });
      prevToken = null;
      i++;
      continue;
    }

    /* ---------- operators & parentheses ---------- */
    if (OPS.includes(ch)) {
      if (ch === "(") {
        const t = { type: TokenType.LPAREN };
        tokens.push(t);
        prevToken = t;
        parenBalance++;
      } else if (ch === ")") {
        parenBalance--;
        if (parenBalance < 0) {
          throw new Error("Unmatched closing parenthesis");
        }
        const t = { type: TokenType.RPAREN };
        tokens.push(t);
        prevToken = t;
      } else {
        const t = { type: TokenType.OPERATOR, value: ch };
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
