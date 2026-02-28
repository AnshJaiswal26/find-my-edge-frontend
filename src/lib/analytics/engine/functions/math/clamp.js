export const CLAMP = {
  argTypes: ["number", "number", "number"],
  returnType: "number",
  semantic: { args: ["number", "number", "number"], return: "number" },
  signature: "CLAMP(expr, min, max)",
  description: "Clamp value to range",

  exec(fn, ctx) {
    const [valueExpr, minExpr, maxExpr] = fn.args;

    const value = ctx.evaluate(valueExpr, ctx);
    const min = ctx.evaluate(minExpr, ctx);
    const max = ctx.evaluate(maxExpr, ctx);

    if (value == null || min == null || max == null) return null;

    return Math.min(Math.max(value, min), max);
  },
};
