export function formatExpression(expr) {
  const strings = [];

  return (
    expr
      // 0️⃣ Protect string literals
      .replace(/"([^"\\]|\\.)*"/g, (m) => {
        const id = `§STR${strings.length}§`;
        strings.push(m);
        return id;
      })

      // 1️⃣ Protect bracketed identifiers completely
      .replace(/\[[^\]]*\]/g, (m) => `§§${m}§§`)

      // 2️⃣ Space binary operators
      .replace(/(\S)\s*([+\/*]|==|!=|<=|>=|<|>)\s*(\S)/g, "$1 $2 $3")

      // 3️⃣ Handle minus carefully (operator, not identifier glue)
      .replace(/(\d|\]|\))\s*-\s*(\d|\[|\()/g, "$1 - $2")

      // 4️⃣ Space commas
      .replace(/\s*,\s*/g, ", ")

      // 5️⃣ Remove space right after '(' and before ')'
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")

      // 6️⃣ Remove space between function name and '('
      .replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s+\(/g, "$1(")

      // 7️⃣ Restore protected identifiers
      .replace(/§§(\[[^\]]*\])§§/g, "$1")

      // 8️⃣ Restore strings
      .replace(/§STR(\d+)§/g, (_, i) => strings[i])

      // 9️⃣ Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}
