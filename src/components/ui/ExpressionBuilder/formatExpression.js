export function formatExpression(expr) {
  return (
    expr
      // 1️⃣ Protect bracketed identifiers completely
      .replace(/\[[^\]]*\]/g, (m) => `§§${m}§§`)

      // 2️⃣ Space binary operators ONLY when between non-word characters
      // This avoids: Risk-Reward → Risk - Reward
      .replace(/(\S)\s*([+\/*]|==|!=|<=|>=|<|>)\s*(\S)/g, "$1 $2 $3")

      // 3️⃣ Handle minus carefully (operator, not identifier glue)
      .replace(/(\d|\]|\))\s*-\s*(\d|\[|\()/g, "$1 - $2")

      // 4️⃣ Space commas
      .replace(/\s*,\s*/g, ", ")

      // 5️⃣ Remove space between function name and '('
      .replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s+\(/g, "$1(")

      // 6️⃣ Restore protected identifiers
      .replace(/§§(\[[^\]]*\])§§/g, "$1")

      // 7️⃣ Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}
