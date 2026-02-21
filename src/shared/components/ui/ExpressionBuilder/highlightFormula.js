import { tokenize } from "@lib/expression";

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
      const displayValue = t.type === "op" && t.value === "u-" ? "-" : raw;

      let className = "";
      switch (t.type) {
        case "number":
          className = "text-[#f78c6c]";
          break;

        case "string":
          className = "text-[#c3e88d]";
          break;

        case "identifier":
          className = "text-[#ff79c6]";
          break;

        case "function":
          className = "text-[#82aaff]";
          break;

        case "op":
          className = "text-[#ffcb6b]";
          break;

        case "comma":
          className = "text-[#ffcb6b]";
          break;

        case "lparen":
        case "rparen":
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
