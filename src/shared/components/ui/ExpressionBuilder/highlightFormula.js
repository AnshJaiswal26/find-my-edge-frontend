import { tokenize } from "@lib/expression";
import { TokenType } from "@lib/expression/ast/tokenType";

export function highlightFormula(text) {
  if (!text) return "";

  try {
    const tokens = tokenize(text);
    let result = "";
    let index = 0;

    const escape = (v) =>
      v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    for (const t of tokens) {
      const raw = String(t.value ?? "");

      // Find this token in original text starting from current index
      const start = text.indexOf(raw, index);

      if (start === -1) continue;

      // Add any text between last token and this one (spaces, etc.)
      result += escape(text.slice(index, start));

      // Normalize display value (hide internal u-)
      const displayValue =
        t.type === TokenType.OPERATOR && t.value === "u-" ? "-" : raw;

      let className = "";
      switch (t.type) {
        case TokenType.NUMBER:
          className = "text-[#f78c6c]";
          break;

        case TokenType.STRING:
          className = "text-[#c3e88d]";
          break;

        case TokenType.IDENTIFIER:
          className = "text-[#ff79c6]";
          break;

        case TokenType.FUNCTION:
          className = "text-[#82aaff]";
          break;

        case TokenType.OPERATOR:
          className = "text-[#ffcb6b]";
          break;

        case TokenType.COMMA:
          className = "text-[#ffcb6b]";
          break;

        case TokenType.LPAREN:
        case TokenType.RPAREN:
          className = "text-[#89ddff]";
          break;

        default:
          result += escape(displayValue);
          index = start + raw.length;
          continue;
      }

      result += `<span class="${className}">${escape(displayValue)}</span>`;

      index = start + raw.length;
    }

    // Add remaining trailing text
    result += escape(text.slice(index));

    return result;
  } catch {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
