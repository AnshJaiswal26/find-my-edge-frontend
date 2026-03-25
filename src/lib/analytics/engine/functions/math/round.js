export const ROUND = {
  args: ["number", "number"],
  returnType: "number",
  signature: "ROUND(expr, digits)",
  description: "Round to N decimal places",

  exec(fn, ctx) {
    const [valueExpr, digitsExpr] = fn.args;

    const value = ctx.evaluate(valueExpr, ctx);
    const digits = ctx.evaluate(digitsExpr, ctx);

    if (value == null) return null;

    const decimals = digits == null ? 0 : Math.floor(digits);
    const factor = Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
  },
};
